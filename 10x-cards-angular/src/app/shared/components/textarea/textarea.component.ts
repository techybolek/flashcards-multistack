import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  template: `
    <textarea
      [placeholder]="placeholder"
      [value]="value"
      [id]="id"
      [disabled]="disabled"
      [required]="required"
      [rows]="rows"
      [cols]="cols"
      (input)="onInput($event)"
      (blur)="onBlur()"
      [ngClass]="[
        'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        class
      ]"
    ></textarea>
  `,
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() class?: string;
  @Input() id?: string;
  @Input() disabled?: boolean;
  @Input() required?: boolean;
  @Input() rows?: number;
  @Input() cols?: number;

  value: any = '';
  
  private onChange = (value: any) => {};
  private onTouched = () => {};

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}