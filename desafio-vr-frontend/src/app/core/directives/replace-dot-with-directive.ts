import { Directive, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appReplaceDotWithComma]',
  standalone: true,
})
export class ReplaceDotWithCommaDirective {
  @Input() prefix: string = '';
  @Input() decimalPlaces: number = 2;
  @Input() allowEmpty: boolean = true;

  private previousValue: string = '';

  constructor(@Optional() @Self() private readonly control?: NgControl) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const cursor = input.selectionStart ?? 0;
    const isDigit = /[0-9]/.test(event.key);
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  
    if (!isDigit && !allowed.includes(event.key)) {
      event.preventDefault();
      return;
    }
  
    const valueOnlyDigits = input.value.replace(/\D/g, '');
  
    const isDeleting = event.key === 'Backspace' || event.key === 'Delete';
    const isBelowMin = valueOnlyDigits.length <= this.decimalPlaces;
  
    if (!this.allowEmpty && isDeleting && isBelowMin) {
      event.preventDefault();
      return;
    }
  
    const deletingPrefixOrComma =
      (event.key === 'Backspace' && cursor <= this.prefix.length) ||
      (event.key === 'Delete' && cursor <= this.prefix.length) ||
      (event.key === 'Backspace' && input.value[cursor - 1] === ',') ||
      (event.key === 'Delete' && input.value[cursor] === ',');
  
    if (!this.allowEmpty && deletingPrefixOrComma) {
      event.preventDefault();
    }
  }
  


  @HostListener('input', ['$event.target'])
  onInput(target: HTMLInputElement): void {
    let digits = target.value.replace(/\D/g, '');

    if (digits.length === 0) {
      this.previousValue = '';
      this.setValue(this.allowEmpty ? null : this.formatNumber('0'), target);
      return;
    }

    if (digits.length <= this.decimalPlaces) {
      digits = digits.padStart(this.decimalPlaces + 1, '0');
    }

    const formatted = this.formatNumber(digits);
    if (formatted !== this.previousValue) {
      this.previousValue = formatted;
      this.setValue(formatted, target);
    }
  }

  @HostListener('blur', ['$event.target'])
  onBlur(target: HTMLInputElement): void {
    const trimmed = target.value.trim();
    if (!trimmed || trimmed === this.prefix) {
      const value = this.allowEmpty ? null : this.formatNumber('0');
      this.previousValue = value ?? '';
      this.setValue(value, target);
    }
  }

  private formatNumber(digits: string): string {
    const intPart = digits.slice(0, digits.length - this.decimalPlaces) || '0';
    const decPart = digits.slice(-this.decimalPlaces).padEnd(this.decimalPlaces, '0');
    return `${this.prefix}${parseInt(intPart, 10)},${decPart}`;
  }

  private setValue(value: string | null, target: HTMLInputElement): void {
    if (this.control?.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
    target.value = value ?? '';
  }
}
