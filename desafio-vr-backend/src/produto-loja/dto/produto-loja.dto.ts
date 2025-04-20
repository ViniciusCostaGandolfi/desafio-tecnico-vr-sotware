import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoLojaDto } from './create-produto-loja.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProdutoLojaDto extends PartialType(CreateProdutoLojaDto) {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id: number;
}
