import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProdutoService } from './produto.service';
import { Produto } from '../entities/produto.entity';
import { ProdutoLoja } from '../../produto-loja/entities/produto-loja.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

describe('ProdutoService', () => {
  let service: ProdutoService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  };

  const mockProdutoRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProdutoLojaRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        { provide: getRepositoryToken(Produto), useValue: mockProdutoRepo },
        { provide: getRepositoryToken(ProdutoLoja), useValue: mockProdutoLojaRepo },
      ],
    }).compile();

    service = module.get(ProdutoService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create deve salvar o produto com buffer', async () => {
    const dto = {
      descricao: 'Produto Teste',
      custo: 10.5,
      imagemBase64: 'data:image/png;base64,aGVsbG8=',
    };

    const produtoCriado = { id: 1, ...dto, imagem: Buffer.from('hello') };

    mockProdutoRepo.create.mockReturnValue(produtoCriado);
    mockProdutoRepo.save.mockResolvedValue(produtoCriado);

    const result = await service.create(dto);

    expect(mockProdutoRepo.create).toHaveBeenCalled();
    expect(mockProdutoRepo.save).toHaveBeenCalledWith(produtoCriado);
    expect(result).toEqual(produtoCriado);
  });

  it('findAll deve retornar PaginationDto vazio', async () => {
    const result = await service.findAll();

    expect(result).toEqual<PaginationDto<Produto>>({
      pageIndex: 0,
      totalPages: 0,
      pageSize: 10,
      totalCount: 0,
      hasPrevious: false,
      hasNext: false,
      data: [],
    });

    expect(mockProdutoRepo.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
  });

  it('findPrecosByProdutoId deve retornar lista de ProdutoLoja', async () => {
    const mockResult = [{ loja: { id: 1 }, precoVenda: 19.9 }];
    mockProdutoLojaRepo.find.mockResolvedValue(mockResult);

    const result = await service.findPrecosByProdutoId(1);

    expect(result).toEqual(mockResult);
    expect(mockProdutoLojaRepo.find).toHaveBeenCalledWith({
      where: { produto: { id: 1 } },
      relations: ['loja'],
    });
  });

  it('findOne deve retornar produto', async () => {
    const produto = { id: 1, descricao: 'Teste', precos: [] };
    mockProdutoRepo.findOne.mockResolvedValue(produto);

    const result = await service.findOne(1);

    expect(result).toEqual(produto);
    expect(mockProdutoRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['precos'],
    });
  });

  it('findOne deve lançar NotFoundException se não existir', async () => {
    mockProdutoRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
  });

  it('update deve alterar e salvar o produto', async () => {
    const produtoOriginal: Produto = {
      id: 1,
      descricao: 'Antigo',
      custo: 10,
      imagem: Buffer.from([]),
      precos: []
    };

    const produtoUpdateDto: UpdateProdutoDto = {
      id: 1,
      descricao: 'Novo',
      custo: 15,
      imagemBase64: 'data:image/png;base64,aGVsbG8='
    };

    const atualizado = {
      ...produtoOriginal,
      descricao: produtoUpdateDto.descricao,
      custo: produtoUpdateDto.custo,
      imagem: Buffer.from('hello'),
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(produtoOriginal);
    mockProdutoRepo.save.mockResolvedValue(atualizado);

    const result = await service.update(1, produtoUpdateDto);

    expect(result).toEqual(atualizado);
    expect(mockProdutoRepo.save).toHaveBeenCalledWith(atualizado);
  });

  it('update deve aceitar imagemBase64 como null e limpar buffer', async () => {
    const produto: Produto = {
      id: 1,
      descricao: 'Produto',
      custo: 10,
      imagem: Buffer.from('img'),
      precos: []
    };

    const produtoUpdateDto: UpdateProdutoDto = {
      id: 1,
      descricao: 'Produto',
      custo: 10,
      imagemBase64: ''
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(produto);
    mockProdutoRepo.save.mockResolvedValue({ ...produto, imagem: null });

    const result = await service.update(1, produtoUpdateDto);

    expect(result.imagem).toBeNull();
  });

  it('remove deve buscar e remover o produto', async () => {
    const produto = { id: 1, descricao: 'A' };
    jest.spyOn(service, 'findOne').mockResolvedValue(produto as Produto);

    await service.remove(1);

    expect(mockProdutoRepo.remove).toHaveBeenCalledWith(produto);
  });

  it('base64ToBuffer deve lançar BadRequest se base64 for inválido', () => {
    const imagemBase64 = 'data:image/png;base64,';

    expect(() => (service as any).base64ToBuffer(imagemBase64)).toThrow(BadRequestException);
  });
});
