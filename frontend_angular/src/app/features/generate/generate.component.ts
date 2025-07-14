import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LabelComponent } from '../../shared/components/label/label.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { GenerateFlashcardsCommand, GenerationResultDTO } from '../../core/types/index';
import { CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent, CardTitleComponent } from '../../shared/components/card/card.component';

interface FlashcardProposal {
  front: string;
  back: string;
  approved: boolean;
  edited: boolean;
}

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    LabelComponent,
    TextareaComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardFooterComponent,
    CardTitleComponent
  ],
  templateUrl: './generate.component.html',
  styleUrl: './generate.component.scss'
})
export class GenerateComponent {
  generateForm: FormGroup;
  isLoading = false;
  step: 'input' | 'review' = 'input';
  proposals: FlashcardProposal[] = [];
  generationId: number | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
  ) {
    this.generateForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1000), Validators.maxLength(10000)]]
    });
  }

  get text() {
    return this.generateForm.get('text');
  }

  get textValue() {
    return this.text?.value || '';
  }

  get approvedCount() {
    return this.proposals.filter(p => p.approved).length;
  }

  handleLoadSample(): void {
    this.http.get('/sampleContent.md', { responseType: 'text' }).subscribe({
      next: (sampleText) => {
        this.generateForm.patchValue({ text: sampleText });
        this.showSuccess('Sample content loaded.');
      },
      error: (error) => {
        this.showError('Failed to load sample content.');
      }
    });
  }

  onSubmit(): void {
    if (this.generateForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const command: GenerateFlashcardsCommand = {
        text: this.textValue
      };

      this.apiService.generateFlashcards(command).subscribe({
        next: (result: GenerationResultDTO) => {
          // Transform the proposals to include approval state
          const proposalsWithState = result.data.flashcardProposals.map(proposal => ({
            ...proposal,
            approved: true, // Default to approved
            edited: false
          }));

          this.proposals = proposalsWithState;
          this.generationId = result.data.generation_id;
          this.step = 'review';

          this.showSuccess(`Generated ${result.data.stats.generated_count} flashcards! Please review them.`);
        },
        error: (error) => {
          this.showError(error.message || 'Failed to generate flashcards. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  handleSave(): void {
    if (!this.generationId) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const approvedCards = this.proposals
      .filter(p => p.approved)
      .map(p => ({
        front: p.front,
        back: p.back,
        source: p.edited ? 'ai-edited' as const : 'ai-full' as const
      }));

    this.apiService.updateGeneration(this.generationId, { flashcards: approvedCards }).subscribe({
      next: () => {
        this.showSuccess('Flashcards saved successfully!');
        this.router.navigate(['/generations', this.generationId]);
      },
      error: (error) => {
        this.showError(error.message || 'Failed to save flashcards. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handleProposalUpdate(index: number, updates: Partial<FlashcardProposal>): void {
    this.proposals = this.proposals.map((proposal, i) => 
      i === index ? { ...proposal, ...updates } : proposal
    );
  }

  handleBulkAction(action: 'approve' | 'reject'): void {
    this.proposals = this.proposals.map(proposal => ({
      ...proposal,
      approved: action === 'approve'
    }));
  }

  backToInput(): void {
    this.step = 'input';
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }
}
