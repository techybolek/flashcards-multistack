import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  standalone: true
})
export class InputComponent {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() class?: string;
}
