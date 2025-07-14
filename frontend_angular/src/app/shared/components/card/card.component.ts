import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
  imports: [NgClass]
})
export class CardComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-header',
  template: '<div class="flex flex-col space-y-1.5 p-6" [ngClass]="class"><ng-content></ng-content></div>',
  standalone: true,
  imports: [NgClass]
})
export class CardHeaderComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-title',
  template: '<h3 class="text-xl font-semibold leading-none tracking-tight" [ngClass]="class"><ng-content></ng-content></h3>',
  standalone: true,
  imports: [NgClass]
})
export class CardTitleComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-description',
  template: '<p class="text-sm text-muted-foreground" [ngClass]="class"><ng-content></ng-content></p>',
  standalone: true,
  imports: [NgClass]
})
export class CardDescriptionComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-content',
  template: '<div class="p-6" [ngClass]="class"><ng-content></ng-content></div>',
  standalone: true,
  imports: [NgClass]
})
export class CardContentComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-footer',
  template: '<div class="flex items-center p-6" [ngClass]="class"><ng-content></ng-content></div>',
  standalone: true,
  imports: [NgClass]
})
export class CardFooterComponent {
  @Input() class?: string;
}
