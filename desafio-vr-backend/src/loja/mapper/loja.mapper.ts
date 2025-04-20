import { Loja } from '../entities/loja.entity';
import { LojaDto } from '../dto/loja.dto';

export class LojaMapper {

  static toLojaDto(loja: Loja): LojaDto {
    return {
      id: loja.id,
      descricao: loja.descricao,
    };
  }

}
