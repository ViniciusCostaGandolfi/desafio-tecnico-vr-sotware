import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProdutosService } from '../../core/services/produtos/produtos.service';
import { ProdutoFilterDto } from '../../core/interfaces/produtos/produto-filter.dto';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationDto } from '../../core/interfaces/pagination.sto';
import { ReplaceDotWithCommaDirective } from '../../core/directives/replace-dot-with-directive';
import { NumberFormatService } from '../../core/services/number-format/number-format.service';
import { CanDeleteDialogComponent } from '../../shared/components/can-delete-dialog/can-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoDto } from '../../core/interfaces/produtos/produto.dto';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReplaceDotWithCommaDirective,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
],
  selector: 'app-produtos-list-page',
  templateUrl: './produtos-list-page.component.html',
  styleUrls: ['./produtos-list-page.component.scss'],

})
export class ProdutosListPageComponent implements OnInit {
  displayedColumns = ['codigo', 'descricao', 'custo'];
  produtos: PaginationDto<ProdutoDto> = {
    pageIndex: 0,
    totalPages: 0,
    pageSize: 10,
    totalCount: 0,
    hasPrevious: false,
    hasNext: false,
    data: []
  };
  isLoading = false
  form =  new FormGroup({
    codigo: new FormControl(null),
    descricao: new FormControl(null),
    custo: new FormControl(null),
    precoVenda: new FormControl(null),

  })

  constructor(
    private readonly produtosService: ProdutosService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly numberFormat: NumberFormatService,

  ) {}

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    const filtro = this.form.value as ProdutoFilterDto;
  
    const parsedFilter: ProdutoFilterDto = {
      ...filtro,
      custo: typeof filtro.custo === 'string' ? this.numberFormat.stringToNumber(filtro.custo) : filtro.custo,
      precoVenda: typeof filtro.precoVenda === 'string' ? this.numberFormat.stringToNumber(filtro.precoVenda) : filtro.precoVenda
    };

  
    this.produtosService.getAllProdutos(parsedFilter, this.produtos.pageIndex, this.produtos.pageSize).subscribe({
      next: (res) => {
        this.produtos = res;
      },
      error: (err) => {
        this.snackBar.open(err.error.message || 'Produtos não encontrados!', 'fechar', {
          panelClass: ['error-snackbar'],
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        })
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    this.produtos.pageIndex = event.pageIndex;
    this.produtos.pageSize = event.pageSize;
    this.loadProdutos()
  }

  onAdd(): void {
    this.router.navigate(['/produtos/cadastro']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/produtos/cadastro/', id]);
  }

  onDelete(id: number): void {
    this.dialog.open(CanDeleteDialogComponent, {
      width: '400px',
      data: {
        message: 'Deseja realmente excluir este produto?',
      }
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.produtosService.deleteProduto(id).subscribe(() => {
          this.loadProdutos();
          this.snackBar.open('Produtos excluido com sucesso!', 'fechar', {
            panelClass: ['success-snackbar'],
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
          })
        });
      }
    });
  }
}
