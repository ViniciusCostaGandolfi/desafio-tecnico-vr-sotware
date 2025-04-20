import { TestBed } from '@angular/core/testing';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { FormControl } from '@angular/forms';

import { NumberFormatService } from './number-format.service';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';


beforeAll(() => registerLocaleData(localePt, 'pt-BR'));


describe('NumberFormatService', () => {
  let service: NumberFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        {
            provide: DecimalPipe,
            useFactory: () => {
                const pipe = new DecimalPipe('pt-BR');
                return pipe;
            },
        },
        NumberFormatService,
      ],    });
    service = TestBed.inject(NumberFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#numberToString formata 1234.5 para "1.234,50"', () => {
    const result = service.numberToString(1234.5);
    expect(result).toBe('1.234,50'); 
  });

  it('#numberToString adiciona prefixo "R$ "', () => {
    const result = service.numberToString(10, 2, 'R$ ');
    expect(result).toBe('R$ 10,00');
  });

  it('#stringToNumber converte "1234,56" em 1234.56', () => {
    expect(service.stringToNumber('1234,56')).toBeCloseTo(1234.56);
  });

  it('stringMaxValidator retorna erro quando valor excede o máximo', () => {
    const ctrl = new FormControl('15,00');
    const err  = service.stringMaxValidator(10)(ctrl);
    expect(err).toEqual({ max: { requiredMax: 10, actual: 15 } });
  });

  it('stringMinValidator retorna null quando valor é aceitável', () => {
    const ctrl = new FormControl('5,00');
    const err  = service.stringMinValidator(0)(ctrl);
    expect(err).toBeNull();
  });
});
