import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, MaxLength } from 'class-validator';

export class CreateProdutoDto {
    @ApiProperty({ example: 'Pizza Calabresa', maxLength: 60 })
    @IsString()
    @MaxLength(60)
    descricao: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ example: 19.9 })
    custo?: number;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
        description: 'Imagem codificada em base64',
    })
    imagemBase64?: string;
}
