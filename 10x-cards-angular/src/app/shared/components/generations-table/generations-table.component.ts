import { Component, Input } from '@angular/core';

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
})
export class GenerationsTableComponent {
  @Input() generations: Generation[] = [];
}
