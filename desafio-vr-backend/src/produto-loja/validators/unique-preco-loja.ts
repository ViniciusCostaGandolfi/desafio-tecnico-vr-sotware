import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProdutoLojaDto } from '../dto/create-produto-loja.dto';
import { ProdutoLoja } from '../entities/produto-loja.entity';
import { BusinessValidator } from './business';
import { UpdateProdutoLojaDto } from '../dto/update-produto-loja.dto';

@Injectable()
export class UniquePrecoLojaValidator implements BusinessValidator<UpdateProdutoLojaDto | CreateProdutoLojaDto> {
  constructor(
    @InjectRepository(ProdutoLoja)
    private readonly repo: Repository<ProdutoLoja>,
  ) {}

  async validate(dto: UpdateProdutoLojaDto | CreateProdutoLojaDto) {
    const found = await this.repo.findOne({
      where: {
        produto: { id: dto.produtoId },
        loja:    { id: dto.lojaId   },
      },
    });

    const isUpdate = 'id' in dto && !!dto.id;
    const isSameRegister  = isUpdate && found && found.id === dto.id;

    if (found && !isSameRegister) {
      throw new BadRequestException(
        'Não é permitido mais que um preço de venda para a mesma loja.',
      );
    }
  }
}
