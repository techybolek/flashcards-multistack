import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class LabelComponent {
  @Input() for?: string;
  @Input() class?: string;
}
