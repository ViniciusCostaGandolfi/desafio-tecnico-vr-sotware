import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loja } from '../entities/loja.entity';
import { Repository } from 'typeorm';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';

@Injectable()
export class LojaService {
  constructor(
    @InjectRepository(Loja)
    private readonly lojaRepository: Repository<Loja>,
  ) {}

  async create(dto: CreateLojaDto): Promise<Loja> {
    return this.lojaRepository.save(this.lojaRepository.create(dto));
  }

  async findAll(): Promise<Loja[]> {
    return this.lojaRepository.find();
  }

  async findOne(id: number): Promise<Loja> {
    const loja = await this.lojaRepository.findOne({
      where: { id },
      relations: ['precos', 'precos.produto'],
    });
    if (!loja) throw new NotFoundException(`Loja ${id} não encontrada`);
    return loja;
  }

  async update(id: number, dto: UpdateLojaDto): Promise<Loja> {
    const loja = await this.findOne(id);
    Object.assign(loja, dto);
    return this.lojaRepository.save(loja);
  }

  async remove(id: number): Promise<void> {
    await this.lojaRepository.remove(await this.findOne(id));
  }
}
