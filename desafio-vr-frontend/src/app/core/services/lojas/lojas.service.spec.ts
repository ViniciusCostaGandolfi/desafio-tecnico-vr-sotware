import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';

import { LojasService } from './lojas.service';
import { environment } from '../../../../environments/environment';

describe('LojasService', () => {
  let service: LojasService;
  let httpCtrl: HttpTestingController;
  const api = `${environment.API_URL}/v1/lojas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),         
        provideHttpClientTesting(),
        LojasService,
      ],
    });

    service  = TestBed.inject(LojasService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpCtrl.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#findAll retorna lista de lojas', () => {
    const mock = [{ id: 1, descricao: 'Loja Alpha' }];

    service.findAll().subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(api);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('#create faz POST e retorna objeto criado', () => {
    const body = { descricao: 'Loja Nova' };
    const mock = { id: 10, ...body };

    service.create(body).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mock);
  });

  it('#update faz PATCH e retorna objeto atualizado', () => {
    const body = { descricao: 'Loja Editada' };
    const mock = { id: 5, ...body };

    service.update(5, body).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(`${api}/5`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mock);
  });

  it('#remove faz DELETE e completa', () => {
    service.remove(7).subscribe((res) => expect(res).toBeNull());
  
    const req = httpCtrl.expectOne(`${api}/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('#remove propaga erro 404 quando não existe', () => {
    service.remove(99).subscribe({
      next: () => fail('should error'),
      error: (err: HttpErrorResponse) => expect(err.status).toBe(404),
    });

    const req = httpCtrl.expectOne(`${api}/99`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
