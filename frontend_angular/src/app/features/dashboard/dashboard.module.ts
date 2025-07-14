import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { GenerationsTableComponent } from '../../shared/components/generations-table/generations-table.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardComponent,
    ButtonComponent,
    GenerationsTableComponent,
  ],
})
export class DashboardModule {}
