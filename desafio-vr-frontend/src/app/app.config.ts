import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './core/providers/custom-paginator-provider';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';


registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: MatPaginatorIntl, useClass: CustomPaginator },

    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
        provide: DecimalPipe,
        useFactory: () => {
            const pipe = new DecimalPipe('pt-BR');
            return pipe;
        },
    }
  ]
};
