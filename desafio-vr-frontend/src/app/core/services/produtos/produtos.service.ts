import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProdutoFilterDto } from '../../interfaces/produtos/produto-filter.dto';
import { PaginationDto } from '../../interfaces/pagination.sto';
import { CreateProdutoDto } from '../../interfaces/produtos/create-produto.dto';
import { UpdateProdutoDto } from '../../interfaces/produtos/update-produto.dto';
import { ProdutoDto } from '../../interfaces/produtos/produto.dto';
import { PrecoProdutoDto } from '../../interfaces/produtos-lojas/preco-produto.dto';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private readonly apiUrl = `${environment.API_URL}/v1/produtos`;

  private readonly imageUploadedSubject = new Subject<string>();
  imageUploaded$ = this.imageUploadedSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  getAllProdutos(
    filtro?: ProdutoFilterDto,
    page = 1,
    pageSize = 10
  ): Observable<PaginationDto<ProdutoDto>> {
    const params: any = {
      page,
      pageSize
    };

    if (filtro) {
      for (const [key, value] of Object.entries(filtro)) {
        if (value !== null && value !== undefined && value !== '') {
          params[key] = value;
        }
      }
    }

    return this.http.get<PaginationDto<ProdutoDto>>(this.apiUrl, { params });
  }

  getAllPrecosByProdutoId(produtoId: number): Observable<PrecoProdutoDto[]> {
    return this.http.get<PrecoProdutoDto[]>(`${this.apiUrl}/${produtoId}/precos`);
  }

  getProdutoById(id: number): Observable<ProdutoDto> {
    return this.http.get<ProdutoDto>(`${this.apiUrl}/${id}`);
  }

  createProduto(dto: CreateProdutoDto): Observable<ProdutoDto> {
    return this.http.post<ProdutoDto>(this.apiUrl, dto);
  }

  updateProduto(id: number, dto: UpdateProdutoDto): Observable<ProdutoDto> {
    return this.http.patch<ProdutoDto>(`${this.apiUrl}/${id}`, dto);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
