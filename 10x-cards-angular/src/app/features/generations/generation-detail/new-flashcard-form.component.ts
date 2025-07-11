import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateFlashcardCommand } from '../../../core/types';

@Component({
  selector: 'app-new-flashcard-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4 p-4 border rounded bg-white">
      <div>
        <label>Question (Front)</label>
        <input class="input input-bordered w-full" formControlName="front" />
      </div>
      <div>
        <label>Answer (Back)</label>
        <input class="input input-bordered w-full" formControlName="back" />
      </div>
      <div>
        <label>Source</label>
        <select class="input input-bordered w-full" formControlName="source">
          <option value="manual">Manual</option>
          <option value="ai-edited">AI Edited</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-primary" type="submit" [disabled]="isSubmitting || form.invalid">Add</button>
        <button class="btn btn-secondary" type="button" (click)="onCancel.emit()">Cancel</button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewFlashcardFormComponent {
  @Input() generationId!: number;
  @Input() isSubmitting = false;
  @Output() onSubmit = new EventEmitter<CreateFlashcardCommand>();
  @Output() onCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      front: ['', Validators.required],
      back: ['', Validators.required],
      source: ['manual', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit({
        ...this.form.value,
        generation_id: this.generationId,
        display_order: 1 // Will be set by parent
      });
    }
  }
} 