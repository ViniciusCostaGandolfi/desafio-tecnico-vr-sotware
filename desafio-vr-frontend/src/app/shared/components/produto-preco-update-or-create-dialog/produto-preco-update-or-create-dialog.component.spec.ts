import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoPrecoUpdateOrCreateDialogComponent } from './produto-preco-update-or-create-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { NumberFormatService } from '../../../core/services/number-format/number-format.service';
import { LojasService } from '../../../core/services/lojas/lojas.service';
import { ProdutosLojasService } from '../../../core/services/produtos-lojas/produtos-lojas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrecoProdutoDto } from '../../../core/interfaces/produtos-lojas/preco-produto.dto';
import { ProdutoLojaDto } from '../../../core/interfaces/produtos-lojas/produto-loja.dto';

describe('ProdutoPrecoUpdateOrCreateDialogComponent', () => {
  let component: ProdutoPrecoUpdateOrCreateDialogComponent;
  let fixture: ComponentFixture<ProdutoPrecoUpdateOrCreateDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ProdutoPrecoUpdateOrCreateDialogComponent>>;
  let mockNumberFormat: jasmine.SpyObj<NumberFormatService>;
  let mockLojasService: jasmine.SpyObj<LojasService>;
  let mockProdutosLojasService: jasmine.SpyObj<ProdutosLojasService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockNumberFormat = jasmine.createSpyObj('NumberFormatService', ['stringToNumber', 'numberToString', 'stringMinValidator']);
    mockLojasService = jasmine.createSpyObj('LojasService', ['findAll']);
    mockProdutosLojasService = jasmine.createSpyObj('ProdutosLojasService', ['create', 'update']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ProdutoPrecoUpdateOrCreateDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { produtoId: 1 } },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: NumberFormatService, useValue: mockNumberFormat },
        { provide: LojasService, useValue: mockLojasService },
        { provide: ProdutosLojasService, useValue: mockProdutosLojasService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoPrecoUpdateOrCreateDialogComponent);
    component = fixture.componentInstance;

    mockLojasService.findAll.and.returnValue(of([]));
    mockNumberFormat.numberToString.and.returnValue('0,00');
    mockNumberFormat.stringMinValidator.and.returnValue(() => null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onCancel and close the dialog', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not submit form if invalid', () => {
    component.form.controls.lojaId.setValue(null);
    component.onSubmit();
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should create a new precoProduto successfully', () => {
    component.form.patchValue({
      lojaId: 1,
      precoVenda: '10,00',
      produtoId: 1
    });
    mockNumberFormat.stringToNumber.and.returnValue(10);
    mockProdutosLojasService.create.and.returnValue(of({ id: 99, lojaId: 1, produtoId: 1, precoVenda: 1 }));
    component.onSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: 99,
      lojaId: 1,
      produtoId: 1,
      precoVenda: 1
    });
  });

  it('should update precoProduto successfully', () => {
    component.form.patchValue({
      id: 99,
      lojaId: 1,
      precoVenda: '20,00',
      produtoId: 1
    });
    mockNumberFormat.stringToNumber.and.returnValue(20);
    mockProdutosLojasService.update.and.returnValue(of({ id: 99, lojaId: 1, produtoId: 1, precoVenda: 1 }));
    component.onSubmit();
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: 99,
      lojaId: 1,
      produtoId: 1,
      precoVenda: 1
    });
  });

  it('should handle API error on submit', () => {
    component.form.patchValue({
      lojaId: 1,
      precoVenda: '0,00',
      produtoId: 1
    });
    mockNumberFormat.stringToNumber.and.returnValue(0);
    mockProdutosLojasService.create.and.returnValue(throwError(() => ({
      error: { message: 'Erro ao salvar preço' }
    })));
    component.onSubmit();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Erro ao salvar preço', 'fechar', jasmine.any(Object));
  });
});
