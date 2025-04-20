# DesafioVrBackend

Este é o backend do sistema desenvolvido com o framework [NestJS](https://nestjs.com/) utilizando TypeScript, PostgreSQL como banco de dados e TypeORM como ORM.

O projeto foi desenvolvido como parte de um desafio técnico com foco em gerenciamento de produtos e preços por loja.

## Tecnologias e Bibliotecas

- **NestJS**: Framework Node.js para aplicações escaláveis e estruturadas.
- **TypeORM**: ORM para integração com PostgreSQL e gerenciamento de entidades, migrations e relacionamentos.
- **PostgreSQL**: Banco de dados relacional utilizado.
- **Jest**: Para testes unitários e testes e2e.
- **Supertest**: Utilizado nos testes de integração.
- **Docker**: Contêinerização do ambiente de backend e banco.
- **Dotenv + ConfigModule**: Gerenciamento de variáveis de ambiente.

## Considerações sobre Imagens

Inicialmente, considerei utilizar um serviço como **MinIO (S3 compatível)** para armazenar imagens, o que seria mais próximo de um ambiente de produção, entanto, devido ao escopo do desafio e aos requisitos definidos, optei por armazenar a imagem diretamente como um campo `imagem: bytea` na tabela `produto`.

---

## Scripts principais

### Instalar dependências

```bash
npm install
```

### Rodar o projeto

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Rodar testes

```bash
npm run test

```

ou de integração


```bash
npm run test:e2e

```

---

## Banco de Dados

### Migrations

Este projeto usa TypeORM com migrations. Para rodar as migrations automaticamente no ambiente Docker:

```bash
npm run migration:run
```

As configurações estão em `src/data-source.ts` e utilizam as variáveis de ambiente definidas no `.env`.

---

## Docker

Você pode executar o backend isoladamente com Docker:

```bash
docker compose -f docker-compose.backend.yml up --build
```

Isso iniciará o backend e o banco de dados PostgreSQL com persistência de dados via volume.

---

## Estrutura

- `src/produto`: CRUD de produtos
- `src/loja`: CRUD de lojas
- `src/produto-loja`: Gestão de preços por loja
- `src/common`: DTOs, filtros globais e middlewares
- `src/migrations`: Migrations geradas por TypeORM


