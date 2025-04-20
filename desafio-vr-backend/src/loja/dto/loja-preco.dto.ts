import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LojaPrecoDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsNumber()
  produtoId: number;

  @ApiProperty({ example: 19.9, description: 'Preço de venda desse produto na loja' })
  @IsNumber()
  precoVenda: number;
}
