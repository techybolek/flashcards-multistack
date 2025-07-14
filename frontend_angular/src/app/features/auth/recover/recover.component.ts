import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LabelComponent } from '../../../shared/components/label/label.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RecoverPasswordCommand } from '../../../core/types/index';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    LabelComponent, 
    InputComponent, 
    ButtonComponent,
    CardComponent
  ]
})
export class RecoverComponent {
  recoverForm: FormGroup;
  message?: string;
  errorMessage?: string;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
    
    this.isLoading = true;
    this.errorMessage = '';
    this.message = '';
    
    const command: RecoverPasswordCommand = this.recoverForm.value;
    
    this.authService.recover(command).subscribe({
      next: () => {
        this.message = 'If an account with this email exists, a recovery link has been sent.';
      },
      error: (error) => {
        this.errorMessage = error.message || 'An error occurred. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get email() {
    return this.recoverForm.get('email');
  }
}
