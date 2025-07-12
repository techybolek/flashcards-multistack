import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { GenerateRoutingModule } from './generate-routing.module';
import { GenerateComponent } from './generate.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LabelComponent } from '../../shared/components/label/label.component';
import { TextareaComponent } from '../../shared/components/textarea/textarea.component';
import { CardComponent } from '../../shared/components/card/card.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenerateRoutingModule,
    GenerateComponent,
    InputComponent,
    ButtonComponent,
    LabelComponent,
    TextareaComponent,
    CardComponent,
  ],
})
export class GenerateModule {}
