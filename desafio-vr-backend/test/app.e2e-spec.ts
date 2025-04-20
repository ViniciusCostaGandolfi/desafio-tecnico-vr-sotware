import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('Swagger (e2e)', () => {
  let app: INestApplication;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('Documentação da API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });


  it('GET /api - deve retornar a documentação do Swagger', async () => {
    const response = await request(app.getHttpServer())
      .get('/api') 
      .expect(200)
      .expect('Content-Type', /html/); 

    expect(response.text).toContain('Swagger UI');
  });

  afterAll(async () => {
    await app.close();
  });
});
