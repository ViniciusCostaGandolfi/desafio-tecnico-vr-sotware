import { ProdutoLoja } from '../entities/produto-loja.entity';
import { ProdutoLojaDto } from '../dto/produto-loja.dto';
import { PrecoProdutoDto } from '../dto/preco-produto.dto';

export class ProdutoLojaMapper {
  static toProdutoLojaDto(ent: ProdutoLoja): ProdutoLojaDto {
    return {
      id: ent.id,
      produtoId: ent.produto?.id,
      lojaId: ent.loja?.id,
      precoVenda: ent.precoVenda,
    };
  }

  static toPrecoProdutoDto(ent: ProdutoLoja): PrecoProdutoDto {
    return {
      id: ent.id,
      produtoId: ent.produto?.id,
      lojaId: ent.loja?.id,
      precoVenda: ent.precoVenda,
      loja: {
        id: ent.loja?.id,
        descricao: ent.loja?.descricao,
      },
    };
  }
}
