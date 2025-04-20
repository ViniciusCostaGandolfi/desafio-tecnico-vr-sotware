import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProdutosLojasService } from './produtos-lojas.service';
import { environment } from '../../../../environments/environment';

describe('ProdutosLojasService', () => {
  let service: ProdutosLojasService;
  let httpCtrl: HttpTestingController;
  const api = `${environment.API_URL}/v1/produtos-lojas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProdutosLojasService,
      ],
    });
    service  = TestBed.inject(ProdutosLojasService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpCtrl.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#create faz POST e retorna o objeto criado', () => {
    const body = { id: 0, lojaId: 1, produtoId: 2, precoVenda: 15 };
    const mock = { ...body, id: 77 };

    service.create(body as any).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mock);
  });

  it('#getById faz GET pelo id', () => {
    const mock = { id: 77, lojaId: 1, produtoId: 2, precoVenda: 15 };

    service.getById(77).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(`${api}/77`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('#update faz PATCH e retorna objeto atualizado', () => {
    const body = { id: 77, lojaId: 1, produtoId: 2, precoVenda: 18 };
    const mock = { ...body };

    service.update(77, body as any).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(`${api}/77`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush(mock);
  });

  it('#delete faz DELETE e completa', () => {
    service.delete(77).subscribe((res) => expect(res).toBeNull());

    const req = httpCtrl.expectOne(`${api}/77`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
