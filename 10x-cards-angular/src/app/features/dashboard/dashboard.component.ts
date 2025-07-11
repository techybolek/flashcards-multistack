import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Generation, GenerationsTableComponent } from '../../shared/components/generations-table/generations-table.component';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, GenerationsTableComponent]
})
export class DashboardComponent implements OnInit {
  generations$?: Observable<Generation[]>;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.generations$ = this.apiService.getGenerations();
  }
}
