import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateLojaDto } from '../../interfaces/lojas/create-loja.dto';
import { LojaDto } from '../../interfaces/lojas/loja';
import { PaginationDto } from '../../interfaces/pagination.sto';
import { UpdateLojaDto } from '../../interfaces/lojas/update-loja.dto.ts';


@Injectable({
  providedIn: 'root'
})
export class LojasService {
  private readonly apiUrl = `${environment.API_URL}/v1/lojas`;

  constructor(private readonly http: HttpClient) {}

  create(dto: CreateLojaDto): Observable<LojaDto> {
    return this.http.post<LojaDto>(this.apiUrl, dto);
  }

  findAll(): Observable<LojaDto[]> {
    return this.http.get<LojaDto[]>(this.apiUrl);
  }

  findOne(id: number): Observable<LojaDto> {
    return this.http.get<LojaDto>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: UpdateLojaDto): Observable<LojaDto> {
    return this.http.patch<LojaDto>(`${this.apiUrl}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
