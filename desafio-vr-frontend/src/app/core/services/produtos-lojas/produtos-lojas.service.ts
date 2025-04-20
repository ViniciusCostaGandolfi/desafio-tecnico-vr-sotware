import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProdutoLojaDto } from '../../interfaces/produtos-lojas/produto-loja.dto';
import { ProdutoLojaUpdateOrCreateDto } from '../../interfaces/produtos-lojas/produto-loja-update-or-create.dt';


@Injectable({
  providedIn: 'root'
})
export class ProdutosLojasService {
  private readonly apiUrl = `${environment.API_URL}/v1/produtos-lojas`;

  constructor(private readonly http: HttpClient) {}

  create(dto: ProdutoLojaUpdateOrCreateDto): Observable<ProdutoLojaDto> {
    return this.http.post<ProdutoLojaDto>(this.apiUrl, dto);
  }

  getById(id: number): Observable<ProdutoLojaDto> {
    return this.http.get<ProdutoLojaDto>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: ProdutoLojaUpdateOrCreateDto): Observable<ProdutoLojaDto> {
    return this.http.patch<ProdutoLojaDto>(`${this.apiUrl}/${id}`, dto);
  }
}
