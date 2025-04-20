import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto<T> {
  @ApiProperty({ example: 0 })
  pageIndex: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 100 })
  totalCount: number;

  @ApiProperty({ example: true })
  hasPrevious: boolean;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ type: [Object] })
  data: T[];

  constructor(params: {
    pageIndex: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    data: T[];
    previousPageLink?: string | null;
    nextPageLink?: string | null;
  }) {
    Object.assign(this, params);
  }

  static from<T>(options: {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    baseUrl: string;
  }): PaginationDto<T> {
    const { data, total, page, pageSize } = options;
    const totalPages = Math.ceil(total / pageSize);

   
    return new PaginationDto({
      pageIndex: page,
      totalPages,
      pageSize: pageSize,
      totalCount: total,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
      data
    });
  }
}