import { Routes } from '@angular/router';
import { ProdutosListPageComponent } from './pages/produtos-list-page/produtos-list-page.component';
import { ProdutoUpdatedOrCreatePageComponent } from './pages/produto-updated-or-create-page/produto-updated-or-create-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'produtos',
    pathMatch: 'full',
  },
  {
    path: 'produtos',
    title: 'Consulta de Produto',
    component: ProdutosListPageComponent
  },
  {
    path: 'produtos/cadastro',
    title: 'Cadastro de Produto',
    component: ProdutoUpdatedOrCreatePageComponent
  },
  {
    path: 'produtos/cadastro/:id',
    title: 'Edição de Produto',
    component: ProdutoUpdatedOrCreatePageComponent 
  }
];
