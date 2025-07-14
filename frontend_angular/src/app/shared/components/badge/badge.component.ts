import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  template: `
    <div [ngClass]="{
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2': true,
      'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
      'text-foreground': variant === 'outline'
    }" [class]="class ?? ''">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  @Input() class?: string;
}