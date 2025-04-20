import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ProdutoFilterDto } from '../dto/produto-filter.dto';
import { ProdutoLoja } from '../../produto-loja/entities/produto-loja.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(ProdutoLoja)
    private readonly produtoLojaRepository: Repository<ProdutoLoja>,
  ) {}

  async create(dto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create({
      ...dto,
      imagem: this.base64ToBuffer(dto.imagemBase64),
    });

    return this.produtoRepository.save(produto);
  }

  async findPrecosByProdutoId(produtoId: number): Promise<ProdutoLoja[]> {
    return this.produtoLojaRepository.find({
      where: { produto: { id: produtoId } },
      relations: ['loja'],
    });
  }
  

  async findAll(
    filtro?: ProdutoFilterDto,
    page = 0,
    pageSize = 10,
  ): Promise<PaginationDto<Produto>> {
    const skip = (page) * pageSize;

    const query = this.produtoRepository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.precos', 'preco');

    if (filtro?.codigo) {
      query.andWhere('produto.id = :id', { id: filtro.codigo });
    }

    if (filtro?.descricao) {
      query.andWhere('produto.descricao ILIKE :descricao', {
        descricao: `%${filtro.descricao}%`,
      });
    }

    if (filtro?.custo !== undefined) {
      query.andWhere('produto.custo = :custo', { custo: filtro.custo });
    }

    if (filtro?.precoVenda !== undefined) {
      query.andWhere('preco.precoVenda = :precoVenda', {
        precoVenda: filtro.precoVenda,
      });
    }

    const [data, total] = await query.skip(skip).take(pageSize).getManyAndCount();

    return PaginationDto.from({
      data,
      total,
      page,
      pageSize,
      baseUrl: '/produto',
    });
  }


  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['precos'],
    });

    if (!produto) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return produto;
  }

  async update(id: number, dto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id);
  
    produto.descricao = dto.descricao ?? produto.descricao;
    produto.custo = dto.custo ?? produto.custo;
    produto.imagem = dto.imagemBase64 === null
    ? null
    : this.base64ToBuffer(dto.imagemBase64);
  
    return this.produtoRepository.save(produto);
  }
  
  

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    await this.produtoRepository.remove(produto);
  }

  private base64ToBuffer(imagemBase64?: string): Buffer | null {
    if (!imagemBase64) return null;

    const base64Data = imagemBase64.split(',')[1];
    if (!base64Data) {
      throw new BadRequestException('Formato inválido para imagem base64.');
    }

    return Buffer.from(base64Data, 'base64');
  }
}
