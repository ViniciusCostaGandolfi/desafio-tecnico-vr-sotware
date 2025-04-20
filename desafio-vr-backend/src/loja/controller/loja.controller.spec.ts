import { Test, TestingModule } from '@nestjs/testing';
import { LojaController } from './loja.controller';
import { LojaService } from '../service/loja.service';
import { LojaMapper } from '../mapper/loja.mapper';
import { Loja } from '../entities/loja.entity';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

const entity: Loja = { id: 1, descricao: 'Loja 1', precos: [] as any };
const dto = { id: 1, descricao: 'Loja 1' };

const mockSvc = {
  create: jest.fn(async () => entity),
  findAll: jest.fn(async () => [entity]),
  findOne: jest.fn(async () => entity),
  update: jest.fn(async () => entity),
  remove: jest.fn(async () => void 0),
};

describe('LojaController', () => {
  let ctrl: LojaController;

  beforeEach(async () => {
    jest.spyOn(LojaMapper, 'toLojaDto').mockReturnValue(dto);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojaController],
      providers: [{ provide: LojaService, useValue: mockSvc }],
    }).compile();

    ctrl = module.get(LojaController);
  });

  afterEach(() => jest.restoreAllMocks());

  it('POST /loja — cria loja', async () => {
    const body: CreateLojaDto = { descricao: 'Nova' };

    const res = await ctrl.create(body);

    expect(res).toEqual(dto);
    expect(mockSvc.create).toHaveBeenCalledWith(body);
  });

  it('GET /loja — lista paginada (sem filtro)', async () => {
    const res = await ctrl.findAll();

    expect(res).toEqual([dto]);
    expect(mockSvc.findAll).toHaveBeenCalledWith();
  });

  it('GET /loja/:id — retorna loja', async () => {
    const res = await ctrl.findOne(1);

    expect(res).toEqual(dto);
    expect(mockSvc.findOne).toHaveBeenCalledWith(1);
  });

  it('PATCH /loja/:id — atualiza loja', async () => {
    const body: UpdateLojaDto = { descricao: 'Alterada' };

    const res = await ctrl.update(1, body);

    expect(res).toEqual(dto);
    expect(mockSvc.update).toHaveBeenCalledWith(1, body);
  });

  it('DELETE /loja/:id — remove loja', async () => {
    await ctrl.remove(1);
    expect(mockSvc.remove).toHaveBeenCalledWith(1);
  });
});
