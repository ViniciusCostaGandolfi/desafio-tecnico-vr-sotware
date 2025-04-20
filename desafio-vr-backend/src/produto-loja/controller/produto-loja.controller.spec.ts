import { Test, TestingModule } from '@nestjs/testing';
import { ProdutoLojaController } from './produto-loja.controller';
import { ProdutoLojaService } from '../service/produto-loja.service';
import { ProdutoLojaMapper } from '../mapper/produto-loja.mapper';
import { CreateProdutoLojaDto } from '../dto/create-produto-loja.dto';

describe('ProdutoLojaController', () => {
  let ctrl: ProdutoLojaController;

  const mockSvc = {
    create : jest.fn(async (dto: CreateProdutoLojaDto) => ({ id: 1, ...dto })),
    findOne: jest.fn(async (id: number) => ({
      id,
      produtoId: 2,
      lojaId: 3,
      precoVenda: 19.9,
    })),
    remove : jest.fn(async () => void 0),
  };

  const expectedDto = {
    id: 1,
    produtoId: 2,
    lojaId: 3,
    precoVenda: 19.9,
  };

  beforeEach(async () => {
    jest
      .spyOn(ProdutoLojaMapper, 'toProdutoLojaDto')
      .mockReturnValue(expectedDto as any);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutoLojaController],
      providers: [{ provide: ProdutoLojaService, useValue: mockSvc }],
    }).compile();

    ctrl = module.get(ProdutoLojaController);
  });

  afterEach(() => jest.restoreAllMocks());

  it('POST /produto-loja — cria e retorna DTO', async () => {
    const dto: CreateProdutoLojaDto = {
      produtoId: 2,
      lojaId: 3,
      precoVenda: 19.9,
    };

    const res = await ctrl.create(dto);

    expect(res).toEqual(expectedDto);
    expect(mockSvc.create).toHaveBeenCalledWith(dto);
    expect(ProdutoLojaMapper.toProdutoLojaDto).toHaveBeenCalled();
  });

  it('GET /produto-loja/:id — retorna DTO por id', async () => {
    const res = await ctrl.getById(1);

    expect(res).toEqual(expectedDto);
    expect(mockSvc.findOne).toHaveBeenCalledWith(1);
    expect(ProdutoLojaMapper.toProdutoLojaDto).toHaveBeenCalled();
  });

  it('DELETE /produto-loja/:id — chama service.remove', async () => {
    await ctrl.delete(1);

    expect(mockSvc.remove).toHaveBeenCalledWith(1);
  });
});
