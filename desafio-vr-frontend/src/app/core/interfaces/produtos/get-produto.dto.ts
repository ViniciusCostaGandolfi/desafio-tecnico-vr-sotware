import { ProdutoPrecoDto } from "./produto-preco.dt";

export interface GetProdutoDto {
    id: number;
    descricao: string;
    custo?: number;
    imagemBase64?: string;
    precos: ProdutoPrecoDto[]
  }
  