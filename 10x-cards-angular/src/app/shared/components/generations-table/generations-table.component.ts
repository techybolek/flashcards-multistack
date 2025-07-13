import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Generation } from '../../../core/services/api.service';
import { ButtonComponent } from '../button/button.component';
import { BadgeComponent } from '../badge/badge.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-generations-table',
  templateUrl: './generations-table.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ButtonComponent, 
    BadgeComponent,
    CardComponent
  ]
})
export class GenerationsTableComponent implements OnInit {
  @Output() error = new EventEmitter<string>();
  
  generations: Generation[] = [];
  loading = true;
  deletingId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGenerations();
  }

  loadGenerations(): void {
    this.loading = true;
    this.apiService.getGenerations().subscribe({
      next: (data: any) => {
        console.log('API response for generations:', data);
        
        // Handle different possible response formats
        if (Array.isArray(data)) {
          this.generations = data;
        } else if (data && Array.isArray(data.generations)) {
          this.generations = data.generations;
        } else if (data && Array.isArray(data.data)) {
          this.generations = data.data;
        } else {
          console.warn('Unexpected API response format:', data);
          this.generations = [];
          this.error.emit(`Unexpected response format: ${typeof data}`);
        }
      },
      error: (err: any) => {
        console.error('Error loading generations:', err);
        const errorMessage = err.message || 'Failed to load generations';
        this.error.emit(errorMessage);
        this.generations = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  handleDeleteGeneration(id: number, name: string): void {
    if (!confirm(`Are you sure you want to delete the generation "${name}"? This will also delete all associated flashcards.`)) {
      return;
    }

    this.deletingId = id;
    this.apiService.deleteGeneration(id).subscribe({
      next: () => {
        this.generations = this.generations.filter(g => g.id !== id);
      },
      error: (err: any) => {
        const errorMessage = err.message || 'Failed to delete generation';
        this.error.emit(errorMessage);
      },
      complete: () => {
        this.deletingId = null;
      }
    });
  }
}
