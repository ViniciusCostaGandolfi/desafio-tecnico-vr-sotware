import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLojaDto {
    @ApiProperty({ example: 'Loja Central', description: 'Descrição da loja (até 60 caracteres)' })
    @IsNotEmpty()
    @MaxLength(60)
    descricao: string;
}
