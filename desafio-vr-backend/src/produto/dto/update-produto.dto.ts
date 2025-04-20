import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
    @ApiProperty({ example: 1, description: 'ID do produto relacionado' })
    @IsNotEmpty()
    @IsNumber()
    id: number;
}
