import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { PrecoProdutoDto } from '../../interfaces/produtos-lojas/preco-produto.dto';
import { ProdutosService } from './produtos.service';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let httpCtrl: HttpTestingController;
  const api = `${environment.API_URL}/v1/produtos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),          
        provideHttpClientTesting(),   
        ProdutosService,
      ],
    });

    service  = TestBed.inject(ProdutosService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpCtrl.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getAllProdutos envia filtros e paginação', () => {
    const mock = { data: [], totalCount: 0 } as any;

    service.getAllProdutos({ descricao: 'Mouse' }, 2, 20).subscribe((res) =>
      expect(res).toEqual(mock)
    );

    const req = httpCtrl.expectOne(
      (r) =>
        r.url === api &&
        r.params.get('page') === '2' &&
        r.params.get('pageSize') === '20' &&
        r.params.get('descricao') === 'Mouse'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('#getProdutoById faz GET pelo id', () => {
    const mock = { id: 3, descricao: 'Teclado', custo: 50 };

    service.getProdutoById(3).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(`${api}/3`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('#getAllPrecosByProdutoId faz GET na sub‑rota', () => {
    const mock: PrecoProdutoDto[] = [{ id: 1, precoVenda: 25, produtoId: 1, loja: {
      id: 1,
      descricao: 'descrição'
    } }];

    service.getAllPrecosByProdutoId(3).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(`${api}/3/precos`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('#createProduto faz POST e retorna objeto criado', () => {
    const body = { descricao: 'Mouse', custo: 30, imagemBase64: '' };
    const mock = { id: 4, ...body };

    service.createProduto(body as any).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mock);
  });

  it('#updateProduto faz PATCH e retorna objeto atualizado', () => {
    const body = { descricao: 'Mouse Pro', custo: 35 };
    const mock = { id: 4, ...body };

    service.updateProduto(4, body as any).subscribe((res) => expect(res).toEqual(mock));

    const req = httpCtrl.expectOne(`${api}/4`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mock);
  });

  it('#deleteProduto faz DELETE e completa', () => {
    service.deleteProduto(4).subscribe((res) => expect(res).toBeNull());

    const req = httpCtrl.expectOne(`${api}/4`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
