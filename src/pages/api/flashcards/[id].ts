import type { APIRoute } from 'astro';
import { supabaseClient } from '../../../db/supabase.client';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Parameter 'id' is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that id is a valid UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return new Response(JSON.stringify({ error: "Parameter 'id' must be a valid UUID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch flashcard from database using Supabase
    const { data: flashcard, error: dbError } = await supabaseClient
      .from('flashcards')
      .select('*')
      .eq('id', parseInt(id, 10))
      .single();

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: 'Error retrieving flashcard' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!flashcard) {
      return new Response(JSON.stringify({ error: 'Flashcard not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: flashcard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;//TRO: id vs string??
    if (!id) {
      return new Response(JSON.stringify({ error: "Parameter 'id' is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that id is a valid UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return new Response(JSON.stringify({ error: "Parameter 'id' must be a valid UUID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { question, answer } = body;
    if (!question && !answer) {
      return new Response(JSON.stringify({ error: "At least one field ('question' or 'answer') is required to update" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = {};
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;

    const { data: updatedFlashcard, error: dbError } = await supabaseClient
      .from('flashcards')
      .update(updateData)
      .eq('id', parseInt(id, 10))
      .single();

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: "Error updating flashcard" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!updatedFlashcard) {
      return new Response(JSON.stringify({ error: 'Flashcard not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: updatedFlashcard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Parameter 'id' is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate that id is a valid UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return new Response(JSON.stringify({ error: "Parameter 'id' must be a valid UUID" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: deletedFlashcard, error: dbError } = await supabaseClient
      .from('flashcards')
      .delete()
      .eq('id', parseInt(id, 10))
      .single();

    if (dbError) {
      console.error(dbError);
      return new Response(JSON.stringify({ error: "Error deleting flashcard" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!deletedFlashcard) {
      return new Response(JSON.stringify({ error: 'Flashcard not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ data: deletedFlashcard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 