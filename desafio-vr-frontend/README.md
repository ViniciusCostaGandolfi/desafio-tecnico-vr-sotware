# DesafioVrFrontend

Este projeto é uma aplicação web construída com Angular 19.2.7, voltada para o gerenciamento de produtos e preços em lojas, conforme especificado em um desafio técnico.

## Tecnologias e Bibliotecas Utilizadas

- Angular: Framework principal para construção do frontend.
- Angular Material: Utilizado para os componentes visuais como tabelas, botões, formulários e dialog modals.
- RxJS: Para manipulação de dados reativos.
- Cypress: Framework utilizado para testes end-to-end automatizados.
- Karma + Jasmine: Utilizados para testes unitários.
- SCSS: Pré-processador CSS para estilos personalizados.

## Scripts

### Servidor de Desenvolvimento

Para rodar o servidor local de desenvolvimento:

```bash
npm start
```

Acesse a aplicação em `http://localhost:4200/`. O Angular recarrega automaticamente ao salvar arquivos.

### Build da Aplicação

Para gerar a versão de produção:

```bash
ng build
```

Os arquivos gerados ficam em `dist/`.

### Testes Unitários

Para executar os testes unitários com Karma:

```bash
npm run test
```

### Testes End-to-End

Os testes E2E são feitos com Cypress. Para rodar os testes headless:

```bash
npx cypress run --browser chromium
```

Ou com interface gráfica:

```bash
npx cypress open
```

Certifique-se de que o servidor frontend esteja rodando antes de executar os testes.

## Estrutura do Projeto

- `src/`: Código-fonte da aplicação
- `cypress/`: Testes end-to-end
- `angular.json`: Configurações do projeto Angular
- `Dockerfile`: Container para ambiente de desenvolvimento Angular
- `Dockerfile.cypress`: Container para rodar testes Cypress com navegador Chromium