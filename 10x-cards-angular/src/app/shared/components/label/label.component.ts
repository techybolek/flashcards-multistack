import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  standalone: true
})
export class LabelComponent {
  @Input() for?: string;
  @Input() class?: string;
}
