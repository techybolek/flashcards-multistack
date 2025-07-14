import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { GenerationsRoutingModule } from './generations-routing.module';
import { GenerationDetailComponent } from './generation-detail/generation-detail.component';
import { GenerationHeaderComponent } from './generation-detail/generation-header.component';
import { NewFlashcardFormComponent } from './generation-detail/new-flashcard-form.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { InputComponent } from '../../shared/components/input/input.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenerationsRoutingModule,
    GenerationDetailComponent,
    GenerationHeaderComponent,
    NewFlashcardFormComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
  ],
})
export class GenerationsModule {}
