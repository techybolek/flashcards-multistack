import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { GenerationsTableComponent } from '../../shared/components/generations-table/generations-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, GenerationsTableComponent]
})
export class DashboardComponent implements OnInit {
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  get user() {
    return this.authService.user;
  }

  handleLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  handleError(errorMessage: string): void {
    this.error = errorMessage;
  }

  dismissError(): void {
    this.error = null;
  }
}
