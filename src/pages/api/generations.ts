import type { APIRoute } from 'astro';
import { z } from 'zod';
import type { GenerateFlashcardsCommand, GenerationResultDTO } from '../../types';
import { DEFAULT_USER_ID, supabaseClient } from '../../db/supabase.client';
import { createHash } from 'crypto';
import fetch from 'node-fetch';

export const prerender = false;

const commandSchema = z.object({
  text: z.string().min(1000, { message: "Tekst jest za krótki" }).max(10000, { message: "Tekst jest za długi" })
});

// Function to call the OpenAI API
const callOpenAIAPI = async (text: string) => {
  const apiKey = import.meta.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates flashcards from text. Create 5-10 high-quality flashcards with a question on the front and an answer on the back. Each flashcard should cover a key concept from the text. Format your response as a JSON array with objects containing "front" and "back" properties.'
          },
          {
            role: 'user',
            content: `Generate flashcards from the following text:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    // Extract the content from the API response
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the JSON content
    let flashcardProposals;
    try {
      // Try to parse the content as JSON
      const parsedContent = JSON.parse(content);
      
      // Ensure it's an array
      if (Array.isArray(parsedContent)) {
        flashcardProposals = parsedContent.map((card: { front?: string; back?: string }) => ({
          front: card.front || '',
          back: card.back || '',
          source: 'ai-full' as const
        }));
      } else {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing JSON from API response:', parseError);
      console.log('API response:', content);
      // If parsing fails, try to extract JSON from the text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsedContent = JSON.parse(jsonMatch[0]);
          flashcardProposals = parsedContent.map((card: { front?: string; back?: string }) => ({
            front: card.front || '',
            back: card.back || '',
            source: 'ai-full' as const
          }));
        } catch (e) {
          throw new Error('Failed to parse JSON from API response');
        }
      } else {
        throw new Error('No JSON array found in API response');
      }
    }
    
    // Calculate generation duration
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const durationSeconds = Math.ceil(durationMs / 1000);
    
    return {
      flashcardProposals,
      stats: {
        generated_count: flashcardProposals.length,
        generation_duration: `PT${durationSeconds}S`
      }
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// Function to generate flashcards using AI
const generateFlashcards = async (text: string) => {
  try {
    return await callOpenAIAPI(text);
  } catch (error) {
    console.error('Error in generateFlashcards:', error);
    throw error;
  }
};

// Function to calculate text hash
const calculateTextHash = (text: string): string => {
  return createHash('sha256').update(text).digest('hex');
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Use a default user id as authentication is not handled at this stage
  const userId = DEFAULT_USER_ID;

  // Parse request body
  let body: GenerateFlashcardsCommand;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Nieprawidłowy format JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate request body
  const parseResult = commandSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(JSON.stringify({ error: parseResult.error.issues }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Calculate text hash for deduplication
    const sourceTextHash = calculateTextHash(body.text);
    
    // Generate flashcards using AI
    const aiResponse = await generateFlashcards(body.text);
    
    // Save generation record to database
    console.log('inserting with userId', userId);
    const { data: generationData, error: generationError } = await supabaseClient
      .from('generations')
      .insert({
        user_id: userId,
        model: 'gpt-4o',
        source_text_hash: sourceTextHash,
        source_text_length: body.text.length,
        generated_count: aiResponse.stats.generated_count,
        generation_duration: aiResponse.stats.generation_duration,
        accepted_unedited_count: 0,
        accepted_edited_count: 0
      })
      .select()
      .single();

    if (generationError) {
      console.error('Error saving generation to database:', generationError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const generation_id = generationData.id;

    const generationResult: GenerationResultDTO = {
      generation_id,
      flashcardProposals: aiResponse.flashcardProposals,
      stats: aiResponse.stats
    };

    return new Response(JSON.stringify(generationResult), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error during generation:', error);
    
    // Log error to generation_error_logs table
    try {
      await supabaseClient
        .from('generation_error_logs')
        .insert({
          user_id: userId,
          model: 'gpt-4o',
          source_text_hash: calculateTextHash(body.text),
          source_text_length: body.text.length,
          error_code: 'GENERATION_ERROR',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
    } catch (logError) {
      console.error('Error logging generation error:', logError);
    }
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 