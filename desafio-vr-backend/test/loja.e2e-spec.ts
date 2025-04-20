import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Loja (CRUD E2E)', () => {
  let app: INestApplication;
  let lojaId: number;

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

  it('POST /lojas - deve criar uma loja', async () => {
    const res = await request(app.getHttpServer())
      .post('/lojas')
      .send({
        descricao: 'Loja E2E Test',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.descricao).toBe('Loja E2E Test');
    lojaId = res.body.id;
  });

  it('GET /lojas - deve listar todas as lojas', async () => {
    const res = await request(app.getHttpServer())
      .get('/lojas')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((l: any) => l.id === lojaId)).toBe(true);
  });

  it('GET /lojas/:id - deve retornar uma loja específica', async () => {
    const res = await request(app.getHttpServer())
      .get(`/lojas/${lojaId}`)
      .expect(200);

    expect(res.body.id).toBe(lojaId);
    expect(res.body.descricao).toBe('Loja E2E Test');
  });

  it('PATCH /lojas/:id - deve atualizar a loja', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/lojas/${lojaId}`)
      .send({ descricao: 'Loja E2E Atualizada' })
      .expect(200);

    expect(res.body.id).toBe(lojaId);
    expect(res.body.descricao).toBe('Loja E2E Atualizada');
  });

  it('DELETE /lojas/:id - deve remover a loja', async () => {
    await request(app.getHttpServer())
      .delete(`/lojas/${lojaId}`)
      .expect(204);
  });
});
