import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutosService } from '../../core/services/produtos/produtos.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NumberFormatService } from '../../core/services/number-format/number-format.service';
import { ProdutoDto } from '../../core/interfaces/produtos/produto.dto';
import { PrecoProdutoDto } from '../../core/interfaces/produtos-lojas/preco-produto.dto';
import { PaginationDto } from '../../core/interfaces/pagination.sto';
import { MatInputModule } from '@angular/material/input';
import { ReplaceDotWithCommaDirective } from '../../core/directives/replace-dot-with-directive';
import { ProdutoPrecoUpdateOrCreateDialogComponent } from '../../shared/components/produto-preco-update-or-create-dialog/produto-preco-update-or-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImageSelectorComponent } from '../../shared/components/image-selector/image-selector.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateProdutoDto } from '../../core/interfaces/produtos/update-produto.dto';
import { CreateProdutoDto } from '../../core/interfaces/produtos/create-produto.dto';
import { CanDeleteDialogComponent } from '../../shared/components/can-delete-dialog/can-delete-dialog.component';
import { ProdutosLojasService } from '../../core/services/produtos-lojas/produtos-lojas.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImageSelectorComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    ReplaceDotWithCommaDirective,
  ],
  selector: 'app-produto-updated-or-create-page',
  templateUrl: './produto-updated-or-create-page.component.html',
  styleUrl: './produto-updated-or-create-page.component.scss'
})
export class ProdutoUpdatedOrCreatePageComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(),
    descricao: new FormControl('', [Validators.required]),
    custo: new FormControl('0,00', [Validators.required]),
    imagemBase64: new FormControl('')
  });

  produto?: ProdutoDto;
  precos: PrecoProdutoDto[]= [];

  isLoading = true;
  displayedColumns = ['loja', 'precoVenda'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly produtosService: ProdutosService,
    private readonly produtosLojasService: ProdutosLojasService,
    private readonly numberFormatService: NumberFormatService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.produtosService.getProdutoById(id).subscribe(produto => {
        this.produto = produto;
        this.form.patchValue({
          id: produto.id,
          descricao: produto.descricao,
          custo: this.numberFormatService.numberToString(produto.custo),
          imagemBase64: produto.imagemBase64
        });

        this.form.controls.custo.setValidators([Validators.required, this.numberFormatService.stringMinValidator(0)])
        this.loadPrecos(produto.id);
      });
    }
    this.isLoading = false;
  }

  loadPrecos(produtoId: number): void {
    this.produtosService.getAllPrecosByProdutoId(produtoId)
      .subscribe(res => {
        this.precos = res;
      });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.snackBar.open('Os campos obrigatórios devem estar preenchidos seguindo o formato e limites esperados.', 'fechar', {
        panelClass: ['error-snackbar'],
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
      })
      return;
    };

    const dto = {
      id: this.produto?.id,
      descricao: this.form.value.descricao,
      custo: this.numberFormatService.stringToNumber(this.form.value.custo),
      imagemBase64: this.form.value.imagemBase64
    };
    const save$ = this.produto?.id
      ? this.produtosService.updateProduto(this.produto.id, dto as UpdateProdutoDto)
      : this.produtosService.createProduto(dto as CreateProdutoDto);

    save$.subscribe({
      next: () => {
        this.snackBar.open("Produto salvo com sucesso!", 'fechar', {
          panelClass: ['success-snackbar'],
          duration: 1000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        })
        this.router.navigate(['/produtos']);
      },
      error: (err) => {
        this.snackBar.open(err.error.message, 'fechar', {
          panelClass: ['error-snackbar'],
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
        })
      }
    });
  }



  onDeleteProduto(): void {
    if (!this.produto?.id) return;
    this.dialog.open(CanDeleteDialogComponent, {
      width: '400px',
      data: {
        message: 'Deseja realmente excluir este produto?',
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed && this.produto) {
        this.produtosService.deleteProduto(this.produto.id).subscribe({
          next: () => {
            this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['produtos'])
          },
          error: (err) => {
            this.snackBar.open(err.error.message, 'fechar', {
              panelClass: ['error-snackbar'],
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
            })
          }
        });
      }
    });;
  }

  onDeletePreco(preco: PrecoProdutoDto): void {
    this.dialog.open(CanDeleteDialogComponent, {
      width: '400px',
      data: {
        message: 'Deseja realmente excluir este preço?',
      }
    }).afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.produtosLojasService.delete(preco.id).subscribe({
          next: () => {
            this.snackBar.open('Preço excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadPrecos(this.produto?.id as number);
          },
          error: (err) => {
            this.snackBar.open(err.error.message, 'fechar', {
              panelClass: ['error-snackbar'],
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
            })
          }
        });
      }
    });;
  }

  openPrecoDialog(preco?: PrecoProdutoDto): void {
    this.dialog.open(ProdutoPrecoUpdateOrCreateDialogComponent, {
      width: '50%',
      height: '50%',
      data: {
        produtoId: this.produto?.id,
        preco: preco
      }
    }).afterClosed().subscribe((result: PrecoProdutoDto | undefined) => {
      if (result && this.produto) {
        this.loadPrecos(this.produto.id)
      };
    });
  }

  onImagemSelecionada(file: string | null) {
    this.form.controls.imagemBase64.setValue(file);
  }

}
