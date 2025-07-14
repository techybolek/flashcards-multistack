import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, finalize } from 'rxjs/operators';
import { ApiService, GenerationDetail } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { CardComponent, CardContentComponent, CardFooterComponent } from '../../../shared/components/card/card.component';
import { GenerationHeaderComponent } from './generation-header.component';
import { NewFlashcardFormComponent } from './new-flashcard-form.component';
import { FlashcardDTO, CreateFlashcardCommand, UpdateFlashcardCommand } from '../../../core/types';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { LabelComponent } from '../../../shared/components/label/label.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';

@Component({
  selector: 'app-generation-detail',
  templateUrl: './generation-detail.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    CardContentComponent,
    CardFooterComponent,
    GenerationHeaderComponent, 
    NewFlashcardFormComponent, 
    FormsModule,
    ButtonComponent,
    LabelComponent,
    TextareaComponent
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
    private apiService: ApiService,
    private router: Router
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
    const updateCommand: UpdateFlashcardCommand = {
      front: this.editFormValues.front,
      back: this.editFormValues.back,
      source: 'ai-edited'
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
    if (!confirm('Are you sure you want to delete this flashcard?')) {
      return;
    }
    this.savingIds.add(flashcard.id);
    this.apiService.deleteFlashcard(flashcard.id).pipe(
      finalize(() => this.savingIds.delete(flashcard.id))
    ).subscribe({
      next: () => this.loadGeneration(),
      error: () => { this.error = 'Failed to delete flashcard.'; }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
