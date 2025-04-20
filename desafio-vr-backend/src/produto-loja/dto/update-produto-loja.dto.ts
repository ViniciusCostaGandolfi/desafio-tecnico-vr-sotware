import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoLojaDto } from './create-produto-loja.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateProdutoLojaDto extends PartialType(CreateProdutoLojaDto) {
    @ApiProperty({ example: 42 })
    @IsNumber()
    id: number;
}
