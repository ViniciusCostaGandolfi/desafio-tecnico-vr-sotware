import { Produto } from '../entities/produto.entity';
import { ProdutoDto } from '../dto/produto.dto';

export class ProdutoMapper {

  static toProdutoDto(produto: Produto): ProdutoDto {
    return {
      id: produto.id,
      descricao: produto.descricao,
      custo: produto.custo,
      imagemBase64: produto.imagem
        ? `data:image/png;base64,${produto.imagem.toString('base64')}`
        : undefined
    };
  }
}
