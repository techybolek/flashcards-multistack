import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ApiService, GenerationDetail } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/components/card/card.component';

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
  imports: [CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent]
})
export class GenerationDetailComponent implements OnInit {
  generation$?: Observable<GenerationDetail>;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.generation$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          // Handle error case, maybe redirect
          throw new Error('Generation ID not found');
        }
        return this.apiService.getGeneration(id);
      })
    );
  }
}
