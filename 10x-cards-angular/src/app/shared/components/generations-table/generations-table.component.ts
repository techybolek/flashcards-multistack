import { Component, Input } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// This should be moved to a proper types file
export interface Generation {
  id: string;
  created_at: string;
  topic: string;
  flashcards_count: number;
}

@Component({
  selector: 'app-generations-table',
  templateUrl: './generations-table.component.html',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink]
})
export class GenerationsTableComponent {
  @Input() generations: Generation[] = [];
}
