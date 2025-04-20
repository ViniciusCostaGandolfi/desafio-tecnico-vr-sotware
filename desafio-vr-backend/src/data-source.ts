import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Produto } from './produto/entities/produto.entity';
import { Loja } from './loja/entities/loja.entity';
import { ProdutoLoja } from './produto-loja/entities/produto-loja.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'desafio_vr',
  synchronize: false,
  logging: true,
  entities: [Produto, Loja, ProdutoLoja],
  migrations: ['src/migrations/*.ts']
});
