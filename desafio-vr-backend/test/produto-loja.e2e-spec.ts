import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProdutoLoja (CRUD E2E)', () => {
  let app: INestApplication;
  let produtoId: number;
  let lojaId: number;
  let precoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const produto = await request(app.getHttpServer())
      .post('/produtos')
      .send({ descricao: 'Produto Preço E2E', custo: 5.5 })
      .expect(201);
    produtoId = produto.body.id;

    const loja = await request(app.getHttpServer())
      .post('/lojas')
      .send({ descricao: 'Loja E2E' })
      .expect(201);
    lojaId = loja.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /produtos-lojas - deve criar um preço', async () => {
    const res = await request(app.getHttpServer())
      .post('/produtos-lojas')
      .send({
        produtoId,
        lojaId,
        precoVenda: 15.99,
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.produtoId).toBe(produtoId);
    expect(res.body.lojaId).toBe(lojaId);
    expect(res.body.precoVenda).toBe(15.99);
    precoId = res.body.id;
  });

  it('PATCH /produtos-lojas/:id - deve atualizar o preço', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/produtos-lojas/${precoId}`)
      .send({
        id: precoId,
        produtoId: produtoId,
        lojaId: lojaId,
        precoVenda: 18.5,
      })
      .expect(200);

    expect(res.body.id).toBe(precoId);
    expect(res.body.precoVenda).toBe(18.5);
  });

  it('DELETE /produtos-lojas/:id - deve deletar o preço', async () => {
    await request(app.getHttpServer())
      .delete(`/produtos-lojas/${precoId}`)
      .expect(204);
  });
});
