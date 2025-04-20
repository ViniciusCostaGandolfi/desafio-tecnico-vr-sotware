import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoLoja } from '../entities/produto-loja.entity';
import { CreateProdutoLojaDto } from '../dto/create-produto-loja.dto';
import { UpdateProdutoLojaDto } from '../dto/update-produto-loja.dto';
import { UniquePrecoLojaValidator } from '../validators/unique-preco-loja';
import { BusinessValidator } from '../validators/business';



@Injectable()
export class ProdutoLojaService {
  private readonly validators: BusinessValidator<any>[];
  constructor(
    @InjectRepository(ProdutoLoja)
    private readonly produtoLojaRepo: Repository<ProdutoLoja>,
    private readonly uniquePrecoLojaValidator: UniquePrecoLojaValidator,
  ) {

    this.validators = [
      this.uniquePrecoLojaValidator
    ];
  }

  private async validate(dto: CreateProdutoLojaDto) {
    for (const validator of this.validators) {
      await validator.validate(dto);
    }
  }

  async create(dto: CreateProdutoLojaDto) {
    await this.validate(dto);

    const preco = this.produtoLojaRepo.create({
      precoVenda: dto.precoVenda,
      produto: { id: dto.produtoId },
      loja: { id: dto.lojaId },
    });
    return this.produtoLojaRepo.save(preco);
  }

  findAll() {
    return this.produtoLojaRepo.find();
  }
  

  async findOne(id: number) {
    const preco = await this.produtoLojaRepo.findOneBy({ id });
    if (!preco) throw new NotFoundException(`ProdutoLoja ${id} não encontrado`);
    return preco;
  }

  async update(id: number, dto: UpdateProdutoLojaDto) {
    const preco = await this.findOne(id);
    Object.assign(preco, {
      precoVenda: dto.precoVenda,
      produto: dto.produtoId ? { id: dto.produtoId } : preco.produto,
      loja: dto.lojaId ? { id: dto.lojaId } : preco.loja,
    });
    return this.produtoLojaRepo.save(preco);
  }

  async remove(id: number) {
    const preco = await this.findOne(id);
    await this.produtoLojaRepo.remove(preco);
  }
}
