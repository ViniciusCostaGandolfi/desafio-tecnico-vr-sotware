export interface PaginationDto<T> {
    pageIndex: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    data: T[];
  }