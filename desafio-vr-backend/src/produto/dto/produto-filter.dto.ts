import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProdutoFilterDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Código identificador do produto',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  codigo?: number;

  @ApiPropertyOptional({
    example: 'Pizza Calabresa',
    maxLength: 60,
    description: 'Descrição do produto (suporta busca parcial)',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    example: 10.5,
    description: 'Custo exato do produto (filtro exato)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  custo?: number;

  @ApiPropertyOptional({
    example: 18.99,
    description: 'Preço de venda do produto (filtro exato)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  precoVenda?: number;
}
