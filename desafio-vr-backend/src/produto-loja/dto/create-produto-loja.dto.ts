import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProdutoLojaDto {
    @ApiProperty({ example: 1, description: 'ID do produto relacionado' })
    @IsNotEmpty()
    @IsNumber()
    produtoId: number;

    @ApiProperty({ example: 2, description: 'ID da loja relacionada' })
    @IsNotEmpty()
    @IsNumber()
    lojaId: number;

    @ApiProperty({ example: 15.99, description: 'Preço de venda do produto na loja' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    precoVenda: number;
}
