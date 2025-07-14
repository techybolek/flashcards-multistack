import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerationDetailComponent } from './generation-detail/generation-detail.component';

const routes: Routes = [
  {
    path: ':id',
    component: GenerationDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerationsRoutingModule {}
