import { supabaseService } from '@/lib/supabase';
import type { 
  FlashcardDTO, 
  CreateFlashcardCommand, 
  UpdateFlashcardCommand 
} from '@/types';
import type { TablesInsert } from '@/types/database.types';

export class FlashcardService {
  async getFlashcards(userId: string): Promise<FlashcardDTO[]> {
    const { data: flashcards, error } = await supabaseService
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error('Error retrieving flashcards');
    }

    return flashcards as FlashcardDTO[];
  }

  async getFlashcard(id: number, userId: string): Promise<FlashcardDTO> {
    const { data: flashcard, error } = await supabaseService
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !flashcard) {
      throw new Error('Flashcard not found');
    }

    return flashcard as FlashcardDTO;
  }

  async createFlashcard(command: CreateFlashcardCommand, userId: string): Promise<FlashcardDTO> {
    const { front, back, source, generation_id, display_order } = command;

    const flashcardToInsert: TablesInsert<'flashcards'> = {
      front,
      back,
      source,
      user_id: userId,
      generation_id: generation_id !== undefined ? Number(generation_id) : null,
      display_order
    };

    const { data: newFlashcard, error } = await supabaseService
      .from('flashcards')
      .insert(flashcardToInsert)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating flashcard: ${error.message}`);
    }

    if (!newFlashcard) {
      throw new Error('Failed to create flashcard, no data returned');
    }

    return newFlashcard as FlashcardDTO;
  }

  async updateFlashcard(id: number, command: UpdateFlashcardCommand, userId: string): Promise<FlashcardDTO> {
    const { front, back, source } = command;

    const updateData: Record<string, any> = {};
    if (front) updateData.front = front;
    if (back) updateData.back = back;
    if (source) updateData.source = source;

    // First check if the flashcard belongs to the user
    const { data: existingFlashcard, error: checkError } = await supabaseService
      .from('flashcards')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingFlashcard) {
      throw new Error('Flashcard not found or access denied');
    }

    // Update the flashcard
    const { data: updatedFlashcard, error } = await supabaseService
      .from('flashcards')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Error updating flashcard');
    }

    return updatedFlashcard as FlashcardDTO;
  }

  async deleteFlashcard(id: number, userId: string): Promise<void> {
    // First check if the flashcard belongs to the user
    const { data: existingFlashcard, error: checkError } = await supabaseService
      .from('flashcards')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingFlashcard) {
      throw new Error('Flashcard not found or access denied');
    }

    // Delete the flashcard
    const { error } = await supabaseService
      .from('flashcards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error('Error deleting flashcard');
    }
  }

}