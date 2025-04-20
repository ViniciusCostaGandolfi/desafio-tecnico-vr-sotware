import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProdutoLojaService } from './produto-loja.service';
import { ProdutoLoja } from '../entities/produto-loja.entity';
import { CreateProdutoLojaDto } from '../dto/create-produto-loja.dto';
import { UniquePrecoLojaValidator } from '../validators/unique-preco-loja';



describe('ProdutoLojaService', () => {
  let service: ProdutoLojaService;
  let repo: Repository<ProdutoLoja>;

  const mockEntity: ProdutoLoja = {
    id: 1,
    precoVenda: 19.9,
    produto: {
      id: 2,
      descricao: '',
      custo: 0,
      imagem: null,
      precos: []
    },
    loja: {
      id: 3,
      descricao: '',
      precos: []
    },
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockEntity),
    save: jest.fn().mockResolvedValue(mockEntity),
    findOneBy: jest.fn().mockResolvedValue(mockEntity),
    find: jest.fn().mockResolvedValue([mockEntity]),
    remove: jest.fn().mockResolvedValue(mockEntity),
  };

  const mockValidator: Partial<UniquePrecoLojaValidator> = {
    validate: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoLojaService,
        { provide: getRepositoryToken(ProdutoLoja), useValue: mockRepo },
        { provide: UniquePrecoLojaValidator, useValue: mockValidator },
      ],
    }).compile();

    service = module.get(ProdutoLojaService);
    repo = module.get(getRepositoryToken(ProdutoLoja));
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('create deve persistir preço', async () => {
    const dto: CreateProdutoLojaDto = {
      produtoId: 2,
      lojaId: 3,
      precoVenda: 19.9,
    };

    const result = await service.create(dto);

    expect(result).toEqual(mockEntity);
    expect(mockValidator.validate).toHaveBeenCalledWith(dto);
    expect(repo.create).toHaveBeenCalledWith({
      precoVenda: 19.9,
      produto: { id: 2 },
      loja: { id: 3 },
    });
    expect(repo.save).toHaveBeenCalledWith(mockEntity);
  });

  it('findOne deve buscar por id', async () => {
    const result = await service.findOne(1);

    expect(result).toEqual(mockEntity);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findAll deve retornar lista', async () => {
    const result = await service.findAll();

    expect(result).toEqual([mockEntity]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('remove deve chamar repo.remove', async () => {
    await service.remove(1);

    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(mockEntity);
  });

  it('update deve modificar e salvar', async () => {
    const updateDto = {
      id: 1,
      precoVenda: 22.5,
      produtoId: 99,
      lojaId: 88,
    };

    const updated = {
      ...mockEntity,
      precoVenda: updateDto.precoVenda,
      produto: { id: updateDto.produtoId },
      loja: { id: updateDto.lojaId },
    };

    jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);
    mockRepo.save.mockResolvedValueOnce(updated);

    const result = await service.update(1, updateDto);

    expect(result).toEqual(updated);
    expect(repo.save).toHaveBeenCalledWith(updated);
  });
});