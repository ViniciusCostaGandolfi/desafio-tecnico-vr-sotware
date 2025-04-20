import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProdutoDto } from './create-produto.dto';

export class ProdutoDto extends PartialType(CreateProdutoDto) {
    @ApiProperty({ example: 1, description: 'ID do produto relacionado' })
    @IsNotEmpty()
    @IsNumber()
    id: number;

}