import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  template: `
    <div class="relative w-full overflow-auto">
      <table [ngClass]="['w-full caption-bottom text-sm', class]">
        <ng-content></ng-content>
      </table>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TableComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-table-header',
  template: `
    <thead [ngClass]="['[&_tr]:border-b', class]">
      <ng-content></ng-content>
    </thead>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TableHeaderComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-table-body',
  template: `
    <tbody [ngClass]="['[&_tr:last-child]:border-0', class]">
      <ng-content></ng-content>
    </tbody>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TableBodyComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-table-row',
  template: `
    <tr [ngClass]="['border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', class]">
      <ng-content></ng-content>
    </tr>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TableRowComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-table-head',
  template: `
    <th [ngClass]="['h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', class]">
      <ng-content></ng-content>
    </th>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TableHeadComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-table-cell',
  template: `
    <td [ngClass]="['p-4 align-middle [&:has([role=checkbox])]:pr-0', class]">
      <ng-content></ng-content>
    </td>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TableCellComponent {
  @Input() class?: string;
}