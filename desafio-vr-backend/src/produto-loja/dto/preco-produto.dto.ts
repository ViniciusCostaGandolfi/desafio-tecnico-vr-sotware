import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoLojaDto } from './create-produto-loja.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { LojaDto } from '../../loja/dto/loja.dto';

export class PrecoProdutoDto extends PartialType(CreateProdutoLojaDto) {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({ example: 1 })
    produtoId: number;

    @ApiProperty({ example: 2 })
    lojaId: number;

    @ApiProperty({ example: 15.99 })
    precoVenda: number;

    @ApiProperty({ type: () => LojaDto })
    loja: LojaDto;
}
