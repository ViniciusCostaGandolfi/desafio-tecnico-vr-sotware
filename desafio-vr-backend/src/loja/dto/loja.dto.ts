import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class LojaDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Supermercado Central', maxLength: 60 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  descricao: string;
}
