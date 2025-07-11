import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../../../shared/components/card/card.component';
import { LabelComponent } from '../../../shared/components/label/label.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent, LabelComponent, InputComponent, ButtonComponent]
})
export class RecoverComponent {
  recoverForm: FormGroup;
  message?: string;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.recoverForm.invalid) {
      return;
    }
    // Placeholder for password recovery logic
    this.message = 'If an account with this email exists, a recovery link has been sent.';
    console.log('Password recovery requested for:', this.recoverForm.value.email);
  }
}
