import { LojaDto } from "../lojas/loja";

export interface PrecoProdutoDto {
    id: number;
    produtoId: number;
    precoVenda: number;
    loja: LojaDto;
}