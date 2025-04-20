import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomPaginator extends MatPaginatorIntl {
  constructor() {
    super();
    this.nextPageLabel = 'Próxima página';
    this.previousPageLabel = 'Página anterior';
    this.itemsPerPageLabel = '';
    this.getRangeLabel = this.customRangeLabel;
  }

  private customRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }

    const totalPages = Math.ceil(length / pageSize);
    if (page >= totalPages) {
      page = totalPages - 1;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}
