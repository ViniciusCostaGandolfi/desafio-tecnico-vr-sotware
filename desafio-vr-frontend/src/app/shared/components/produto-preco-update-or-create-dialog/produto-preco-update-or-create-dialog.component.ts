import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PrecoProdutoDto } from '../../../core/interfaces/produtos-lojas/preco-produto.dto';
import { LojasService } from '../../../core/services/lojas/lojas.service';
import { LojaDto } from '../../../core/interfaces/lojas/loja';
import { MatIconModule } from '@angular/material/icon';
import { NumberFormatService } from '../../../core/services/number-format/number-format.service';
import { ReplaceDotWithCommaDirective } from '../../../core/directives/replace-dot-with-directive';
import { ProdutosLojasService } from '../../../core/services/produtos-lojas/produtos-lojas.service';
import { ProdutoLojaUpdateOrCreateDto } from '../../../core/interfaces/produtos-lojas/produto-loja-update-or-create.dt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-produto-preco-update-or-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReplaceDotWithCommaDirective,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './produto-preco-update-or-create-dialog.component.html',
  styleUrls: ['./produto-preco-update-or-create-dialog.component.scss']
})
export class ProdutoPrecoUpdateOrCreateDialogComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl<number | null>(null),
    lojaId: new FormControl<number | null>(null, [Validators.required]),
    produtoId: new FormControl<number | null>(null, [Validators.required]),
    precoVenda: new FormControl('0,00'),
  });
  lojas: LojaDto[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { produtoId: number, preco?: PrecoProdutoDto },
    private dialogRef: MatDialogRef<ProdutoPrecoUpdateOrCreateDialogComponent>,
    private readonly numberFormatService: NumberFormatService,
    private readonly lojasService: LojasService,
    private readonly produtosLojasService: ProdutosLojasService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form.patchValue({
      id: this.data?.preco?.id as number | null,
      lojaId: this.data?.preco?.loja.id as number | null,
      produtoId: this.data.produtoId as number | null,
      precoVenda: this.numberFormatService.numberToString(this.data?.preco?.precoVenda)
    });
    this.form.controls.precoVenda.setValidators([this.numberFormatService.stringMinValidator(0), Validators.required])
    this.lojasService.findAll().subscribe(res => {
      this.lojas = res;
    });
  }

  onSubmit(): void {
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
      id: this.form.value.id!,
      lojaId: this.form.value.lojaId!,
      produtoId: this.data.produtoId,
      precoVenda: this.numberFormatService.stringToNumber(this.form.value.precoVenda!)
    };
  
    const action$ = this.form.value.id
      ? this.produtosLojasService.update(this.form.value.id, dto as ProdutoLojaUpdateOrCreateDto)
      : this.produtosLojasService.create(dto as ProdutoLojaUpdateOrCreateDto);
  
    action$.subscribe({
      next: (res) => this.dialogRef.close(res),
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
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
