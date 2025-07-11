import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-header',
  template: '<div class="flex flex-col space-y-1.5 p-6" [ngClass]="class"><ng-content></ng-content></div>',
})
export class CardHeaderComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-title',
  template: '<h3 class="text-2xl font-semibold leading-none tracking-tight" [ngClass]="class"><ng-content></ng-content></h3>',
})
export class CardTitleComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-description',
  template: '<p class="text-sm text-muted-foreground" [ngClass]="class"><ng-content></ng-content></p>',
})
export class CardDescriptionComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-content',
  template: '<div class="p-6 pt-0" [ngClass]="class"><ng-content></ng-content></div>',
})
export class CardContentComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-card-footer',
  template: '<div class="flex items-center p-6 pt-0" [ngClass]="class"><ng-content></ng-content></div>',
})
export class CardFooterComponent {
  @Input() class?: string;
}
