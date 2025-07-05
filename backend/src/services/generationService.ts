import { supabaseService } from '@/lib/supabase';
import { OpenRouterService } from '@/lib/openrouter';
import { createHash } from 'crypto';
import type { 
  GenerateFlashcardsCommand, 
  GenerationResultDTO,
  GenerationStatsDTO,
  FlashcardProposalDTO
} from '@/types';

export class GenerationService {
  private openRouterService: OpenRouterService;

  constructor() {
    console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
    this.openRouterService = new OpenRouterService({
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultModel: 'gpt-4o-mini',
      maxRetries: 3,
      timeout: 60000,
      cacheEnabled: true
    });
  }

  async generateFlashcards(command: GenerateFlashcardsCommand, userId: string): Promise<GenerationResultDTO> {
    const { text } = command;
    
    // Calculate text hash for deduplication
    const sourceTextHash = this.calculateTextHash(text);
    
    try {
      // Generate flashcards using AI
      const aiResponse = await this.generateFlashcardsFromText(text);
      
      // Generate a title for this set of flashcards
      const generationName = await this.generateTitleForText(text);
      
      // Save generation record to database using service client
      const { data: generationData, error: generationError } = await supabaseService
        .from('generations')
        .insert({
          user_id: userId,
          model: 'deepseek-reasoner',
          source_text_hash: sourceTextHash,
          source_text_length: text.length,
          generated_count: aiResponse.stats.generated_count,
          generation_duration: aiResponse.stats.generation_duration,
          accepted_unedited_count: 0,
          accepted_edited_count: 0,
          generation_name: generationName
        })
        .select()
        .single();

      if (generationError) {
        console.error('Error saving generation to database:', generationError);
        throw new Error('Database error');
      }

      const generation_id = generationData.id;

      return {
        generation_id,
        generation_name: generationName,
        flashcardProposals: aiResponse.flashcardProposals,
        stats: aiResponse.stats
      };
    } catch (error) {
      console.error('Error during generation:', error);
      
      // Log error to generation_error_logs table
      try {
        await supabaseService
          .from('generation_error_logs')
          .insert({
            user_id: userId,
            model: 'deepseek-reasoner',
            source_text_hash: sourceTextHash,
            source_text_length: text.length,
            error_code: 'GENERATION_ERROR',
            error_message: error instanceof Error ? error.message : String(error)
          });
      } catch (logError) {
        console.error('Error logging generation error:', logError);
      }
      
      throw new Error('Wystąpił błąd podczas generowania fiszek');
    }
  }

  async getGenerations(userId: string) {
    const { data: generations, error: generationsError } = await supabaseService
      .from('generations')
      .select('id, created_at, generated_count, generation_name')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (generationsError) {
      console.error('Database error:', generationsError);
      throw new Error('Failed to load generations');
    }

    return { generations };
  }

  async getGeneration(id: number, userId: string) {
    const { data: generation, error } = await supabaseService
      .from('generations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !generation) {
      throw new Error('Generation not found');
    }

    return generation;
  }

  async getGenerationFlashcards(generationId: number, userId: string) {
    // First verify the generation belongs to the user
    const generation = await this.getGeneration(generationId, userId);
    
    const { data: flashcards, error } = await supabaseService
      .from('flashcards')
      .select('*')
      .eq('generation_id', generationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error('Error retrieving flashcards for generation');
    }

    return flashcards;
  }

  private async generateFlashcardsFromText(text: string): Promise<{
    flashcardProposals: FlashcardProposalDTO[];
    stats: GenerationStatsDTO;
  }> {
    const startTime = Date.now();
    
    try {
      // Format system message
      const systemMessage = this.openRouterService.formatSystemMessage({
        systemPrompt: 'You are a helpful assistant that generates flashcards from text. Create 5-10 high-quality flashcards with a question on the front and an answer on the back. Each flashcard should cover a key concept from the text. Format your response as a JSON array with objects containing "front" and "back" properties. JSON only, no extra text or tags.',
        temperature: 0.7,
        maxTokens: 2000
      });
      
      // Call the OpenRouter service
      const response = await this.openRouterService.chat([
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: `Generate flashcards from the following text:\n\n${text}`
        }
      ], {
        temperature: 0.7,
        max_tokens: 2000
      });
      
      // Extract the content from the API response
      const content = response.content;
      
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
      console.error('Error generating flashcards:', error);
      throw error;
    }
  }

  private async generateTitleForText(text: string): Promise<string> {
    try {
      const systemMessage = this.openRouterService.formatSystemMessage({
        systemPrompt: 'Generate a short, descriptive title (maximum 40 characters) that captures the main topic or theme of the text. The title should help users quickly identify what this set of flashcards is about. Respond with just the title, no additional text or formatting.',
        temperature: 0.7,
        maxTokens: 100
      });

      const response = await this.openRouterService.chat([
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: `Generate a title for flashcards based on this text:\n\n${text}`
        }
      ], {
        temperature: 0.7,
        max_tokens: 100
      });

      // Extract and clean the title
      let title = response.content.trim();
      
      // Remove any quotes if present
      title = title.replace(/^["']|["']$/g, '');
      
      // Ensure the title doesn't exceed 40 characters
      if (title.length > 40) {
        title = title.substring(0, 37) + '...';
      }

      return title;
    } catch (error) {
      console.error('Error generating title:', error);
      // Return a fallback title if generation fails
      return 'Generated Flashcards';
    }
  }

  private calculateTextHash(text: string): string {
    return createHash('sha256').update(text).digest('hex');
  }

  async deleteGeneration(id: number, userId: string): Promise<void> {
    // First verify the generation belongs to the user
    const generation = await this.getGeneration(id, userId);
    
    // Delete associated flashcards first (due to foreign key constraints)
    const { error: flashcardsError } = await supabaseService
      .from('flashcards')
      .delete()
      .eq('generation_id', id)
      .eq('user_id', userId);

    if (flashcardsError) {
      throw new Error('Error deleting associated flashcards');
    }

    // Delete the generation
    const { error: generationError } = await supabaseService
      .from('generations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (generationError) {
      throw new Error('Error deleting generation');
    }
  }
}