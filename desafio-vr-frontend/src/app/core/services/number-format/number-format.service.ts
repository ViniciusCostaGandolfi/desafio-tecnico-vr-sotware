import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {
  constructor(private readonly decimalPipe: DecimalPipe) {}

  numberToString(
    value: number | string | null | undefined,
    decimal = 2,
    prefix = ''
  ): string {
    if (!value) {
      return `${prefix}0,00`
    }
    const formatted = this.decimalPipe.transform(value as number, `1.${decimal}-${decimal}`, 'pt-BR');
    return `${prefix}${formatted ?? '0,00'}`;
  }

  stringToNumber(value: string  | null | undefined): number {
    if (!value) return 0;

    const sanitized = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? 0 : parsed;
  }

  stringMaxValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = this.stringToNumber(control.value);
      return value > max ? { max: { requiredMax: max, actual: value } } : null;
    };
  }

  stringMinValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = this.stringToNumber(control.value);
      return value < min ? { min: { requiredMin: min, actual: value } } : null;
    };
  }
}
