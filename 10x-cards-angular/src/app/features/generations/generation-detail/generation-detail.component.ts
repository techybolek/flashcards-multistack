import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap, map } from 'rxjs';
import { ApiService, GenerationDetail } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/components/card/card.component';
import { GenerationHeaderComponent } from './generation-header.component';
import { NewFlashcardFormComponent } from './new-flashcard-form.component';
import { FlashcardDTO, CreateFlashcardCommand, UpdateFlashcardCommand } from '../../../core/types';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

// TODO: Move to a proper types file
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}


@Component({
  selector: 'app-generation-detail',
  templateUrl: './generation-detail.component.html',
  standalone: true,
  imports: [
    CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    GenerationHeaderComponent, NewFlashcardFormComponent, FormsModule
  ]
})
export class GenerationDetailComponent implements OnInit {
  generation$?: Observable<GenerationDetail>;
  flashcards: FlashcardDTO[] = [];
  generation: GenerationDetail | null = null;
  isLoading = true;
  error: string | null = null;
  showAddForm = false;
  isAddingCard = false;
  savingIds = new Set<number>();
  editingFlashcardId: number | null = null;
  editFormValues: { front: string; back: string } = { front: '', back: '' };
  isSavingEdit = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadGeneration();
  }

  loadGeneration() {
    this.isLoading = true;
    this.error = null;
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error = 'Generation ID not found';
          this.isLoading = false;
          return of(null);
        }
        return this.apiService.getGeneration(id).pipe(
          map(response => response.data),
          catchError(err => {
            this.error = 'Failed to load generation.';
            this.isLoading = false;
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );
      })
    ).subscribe(generation => {
      if (generation) {
        this.generation = generation;
        this.flashcards = generation.flashcards;
      }
    });
  }

  handleAddSubmit(command: CreateFlashcardCommand) {
    if (!this.generation) return;
    this.isAddingCard = true;
    // Calculate next display order
    const nextDisplayOrder = this.flashcards.length > 0
      ? Math.max(...this.flashcards.map(f => f.display_order)) + 1
      : 1;
    this.apiService.createFlashcard({
      ...command,
      generation_id: this.generation.id,
      display_order: nextDisplayOrder
    }).pipe(finalize(() => this.isAddingCard = false)).subscribe({
      next: () => {
        this.showAddForm = false;
        this.loadGeneration();
      },
      error: () => {
        this.error = 'Failed to add flashcard.';
      }
    });
  }

  // Called when user clicks Edit button
  startEditFlashcard(flashcard: FlashcardDTO) {
    this.editingFlashcardId = flashcard.id;
    this.editFormValues = {
      front: flashcard.front,
      back: flashcard.back
    };
    this.error = null;
  }

  // Called when user clicks Save in edit mode
  saveEditFlashcard(flashcard: FlashcardDTO) {
    this.isSavingEdit = true;
    this.savingIds.add(flashcard.id);
    const updateCommand = {
      front: this.editFormValues.front,
      back: this.editFormValues.back,
      source: flashcard.source // keep the original source
    };
    this.apiService.updateFlashcard(flashcard.id, updateCommand).pipe(
      finalize(() => {
        this.savingIds.delete(flashcard.id);
        this.isSavingEdit = false;
      })
    ).subscribe({
      next: () => {
        this.editingFlashcardId = null;
        this.loadGeneration();
      },
      error: () => {
        this.error = 'Failed to edit flashcard.';
      }
    });
  }

  // Called when user clicks Cancel in edit mode
  cancelEditFlashcard() {
    this.editingFlashcardId = null;
    this.editFormValues = { front: '', back: '' };
    this.error = null;
  }

  handleDelete(flashcard: FlashcardDTO) {
    this.savingIds.add(flashcard.id);
    this.apiService.deleteFlashcard(flashcard.id).pipe(
      finalize(() => this.savingIds.delete(flashcard.id))
    ).subscribe({
      next: () => this.loadGeneration(),
      error: () => { this.error = 'Failed to delete flashcard.'; }
    });
  }
}
