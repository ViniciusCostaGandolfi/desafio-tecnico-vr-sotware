import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Produto e ProdutoLoja E2E', () => {
  let app: INestApplication;

  let produtoId: number;
  let precoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /produtos - deve criar um produto', async () => {
    const response = await request(app.getHttpServer())
      .post('/produtos')
      .send({
        descricao: 'Produto E2E',
        custo: 10.5,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.descricao).toBe('Produto E2E');
    produtoId = response.body.id;
  });

  it('POST /produtos-lojas - deve criar um preço para o produto em uma loja', async () => {
    const response = await request(app.getHttpServer())
      .post('/produtos-lojas')
      .send({
        produtoId,
        lojaId: 1,
        precoVenda: 20.0,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.produtoId).toBe(produtoId);
    precoId = response.body.id;
  });

  it('GET /produtos/:id/precos - deve retornar os preços do produto', async () => {
    const response = await request(app.getHttpServer())
      .get(`/produtos/${produtoId}/precos`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].id).toBe(precoId);
  });

  it('PATCH /produtos/:id - deve atualizar o produto', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/produtos/${produtoId}`)
      .send({
        id: produtoId,
        descricao: 'Produto E2E Atualizado',
        custo: 10.5,
      })
      .expect(200);

    expect(response.body.descricao).toBe('Produto E2E Atualizado');
  });

  it('DELETE /produtos/:id - deve remover o produto', async () => {
    await request(app.getHttpServer())
      .delete(`/produtos/${produtoId}`)
      .expect(204);
  });
});
