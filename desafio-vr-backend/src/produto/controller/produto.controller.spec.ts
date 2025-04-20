import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from '../service/produto.service';
import { ProdutoMapper } from '../mapper/product.mapper';
import { Produto } from '../entities/produto.entity';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { ProdutoFilterDto } from '../dto/produto-filter.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

describe('ProdutoController', () => {
  let controller: ProdutoController;
  let service: ProdutoService;

  const produtoEntity: Produto = {
    id: 1,
    descricao: 'Produto Stub',
    custo: 12.5,
    imagem: Buffer.from([]),
    precos: [],
  };

  const produtoDto = {
    id: 1,
    descricao: 'Produto Stub',
    custo: 12.5,
    imagemBase64: 'data:image/png;base64,',
    precos: [],
  };

  const mockProdutoService = {
    create: jest.fn().mockResolvedValue(produtoEntity),
    findAll: jest.fn().mockResolvedValue(
      PaginationDto.from({
        data: [produtoEntity],
        total: 1,
        page: 1,
        pageSize: 10,
        baseUrl: '/produtos',
      }),
    ),
    findOne: jest.fn().mockResolvedValue(produtoEntity),
    update: jest.fn().mockResolvedValue(produtoEntity),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(ProdutoMapper, 'toProdutoDto').mockImplementation(() => ({ ...produtoDto }));

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoController],
      providers: [{ provide: ProdutoService, useValue: mockProdutoService }],
    }).compile();

    controller = module.get<ProdutoController>(ProdutoController);
    service = module.get<ProdutoService>(ProdutoService);
  });

  it('should create a product (POST /produtos)', async () => {
    const input: CreateProdutoDto = {
      descricao: 'Produto Stub',
      custo: 12.5,
    };

    const result = await controller.create(input);

    expect(result).toEqual(produtoDto);
    expect(service.create).toHaveBeenCalledWith(input);
    expect(ProdutoMapper.toProdutoDto).toHaveBeenCalledWith(produtoEntity);
  });

  it('should return paginated products (GET /produtos)', async () => {
    const result = await controller.findAll(undefined, 1, 10);

    expect(result.totalCount).toBe(1);
    expect(result.data).toEqual([produtoDto]);
    expect(service.findAll).toHaveBeenCalledWith(undefined, 1, 10);
  });

  it('should return paginated products with filter', async () => {
    const filter: ProdutoFilterDto = { descricao: 'Stub' };

    await controller.findAll(filter, 2, 5);

    expect(service.findAll).toHaveBeenCalledWith(filter, 2, 5);
  });

  it('should return product by ID (GET /produtos/:id)', async () => {
    const result = await controller.findOne(1);

    expect(result).toEqual(produtoDto);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a product (PATCH /produtos/:id)', async () => {
    const updateDto: UpdateProdutoDto = { id: 1, descricao: 'Atualizado' };

    const result = await controller.update(1, updateDto);

    expect(result).toEqual(produtoDto);
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('should delete a product (DELETE /produtos/:id)', async () => {
    await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
