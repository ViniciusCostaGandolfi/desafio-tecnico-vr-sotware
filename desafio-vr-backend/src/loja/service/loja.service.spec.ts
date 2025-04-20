import { Test, TestingModule } from '@nestjs/testing';
import { LojaService } from './loja.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loja } from '../entities/loja.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';

describe('LojaService', () => {
  let service: LojaService;
  let repo: Repository<Loja>;

  const lojaEntity: Loja = {
    id: 1,
    descricao: 'Loja 1',
    precos: [],
  };

  const mockQB = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[lojaEntity], 1]),
  };

  const mockRepo = {
    find: jest.fn().mockResolvedValue([lojaEntity]),
    createQueryBuilder: jest.fn().mockReturnValue(mockQB),
    findOne: jest.fn().mockResolvedValue(lojaEntity),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojaService,
        { provide: getRepositoryToken(Loja), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(LojaService);
    repo = module.get(getRepositoryToken(Loja));
  });

  afterEach(() => jest.clearAllMocks());

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deve retornar uma lista de lojas', async () => {
    const lojas = await service.findAll();

    expect(lojas).toEqual<Loja[]>([lojaEntity]);

    expect(lojas).toEqual<Loja[]>([lojaEntity]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('findOne deve retornar loja com precos e produtos', async () => {
    const result = await service.findOne(1);

    expect(result).toEqual(lojaEntity);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['precos', 'precos.produto'],
    });
  });
});
