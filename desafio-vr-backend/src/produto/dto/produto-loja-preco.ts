import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ProdutoLojaPrecoDto {
  @ApiProperty({ example: 1, description: 'ID da loja associada ao preço' })
  @IsNumber()
  lojaId: number;

  @ApiProperty({ example: 19.9, description: 'Preço de venda do produto na loja' })
  @IsNumber()
  precoVenda: number;
}
