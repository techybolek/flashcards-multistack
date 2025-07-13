import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-generation-header',
  template: `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between py-4 border-b mb-4">
      <div>
        <h1 class="text-3xl font-bold">{{ name }}</h1>
        <p class="text-muted-foreground">{{ flashcardCount }} cards</p>
        <p class="text-xs text-gray-400">Created: {{ createdAt | date:'medium' }}</p>
      </div>
      <button class="btn btn-primary mt-4 md:mt-0" (click)="onAddClick.emit()">Add Flashcard</button>
    </div>
  `,
  standalone: true,
  imports: [DatePipe]
})
export class GenerationHeaderComponent {
  @Input() name!: string;
  @Input() flashcardCount!: number;
  @Input() createdAt!: string;
  @Input() isAdding: boolean = false;
  @Output() onAddClick = new EventEmitter<void>();
} 