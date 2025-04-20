import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProdutoUpdatedOrCreatePageComponent } from './produto-updated-or-create-page.component';
import { ProdutosService } from '../../core/services/produtos/produtos.service';
import { ProdutosLojasService } from '../../core/services/produtos-lojas/produtos-lojas.service';
import { NumberFormatService } from '../../core/services/number-format/number-format.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrecoProdutoDto } from '../../core/interfaces/produtos-lojas/preco-produto.dto';
import { ProdutoPrecoDto } from '../../core/interfaces/produtos/produto-preco.dt';

describe('ProdutoUpdatedOrCreatePageComponent', () => {
  let component: ProdutoUpdatedOrCreatePageComponent;
  let fixture: ComponentFixture<ProdutoUpdatedOrCreatePageComponent>;
  let produtosServiceSpy: jasmine.SpyObj<ProdutosService>;
  let produtosLojasServiceSpy: jasmine.SpyObj<ProdutosLojasService>;
  let numberFormatServiceSpy: jasmine.SpyObj<NumberFormatService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const produtosServiceMock = jasmine.createSpyObj('ProdutosService', [
      'getProdutoById', 'getAllPrecosByProdutoId', 'deleteProduto', 'createProduto', 'updateProduto'
    ]);
    const produtosLojasServiceMock = jasmine.createSpyObj('ProdutosLojasService', ['delete']);
    const numberFormatMock = jasmine.createSpyObj('NumberFormatService', ['stringToNumber', 'numberToString', 'stringMinValidator']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    numberFormatMock.stringMinValidator.and.returnValue(() => null);



    await TestBed.configureTestingModule({
      imports: [ProdutoUpdatedOrCreatePageComponent],
      providers: [
        { provide: ProdutosService, useValue: produtosServiceMock },
        { provide: ProdutosLojasService, useValue: produtosLojasServiceMock },
        { provide: NumberFormatService, useValue: numberFormatMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoUpdatedOrCreatePageComponent);
    component = fixture.componentInstance;

    produtosServiceSpy = TestBed.inject(ProdutosService) as jasmine.SpyObj<ProdutosService>;
    produtosLojasServiceSpy = TestBed.inject(ProdutosLojasService) as jasmine.SpyObj<ProdutosLojasService>;
    numberFormatServiceSpy = TestBed.inject(NumberFormatService) as jasmine.SpyObj<NumberFormatService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    produtosServiceSpy.getAllPrecosByProdutoId.and.returnValue(of([{
      id: 1,
      produtoId: 1,
      precoVenda: 1,
      loja: {
        id: 1,
        descricao: ''
      }
    }]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show snackbar error if form is invalid on save', () => {
    component.form.controls['descricao'].setValue('');
    component.onSave();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Os campos obrigatórios devem estar preenchidos seguindo o formato e limites esperados.',
      'fechar',
      jasmine.any(Object)
    );
  });

  it('should call deleteProduto and navigate on confirm', fakeAsync(() => {
    component.produto = { id: 1, descricao: 'Teste', custo: 10, imagemBase64: '' };
  
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as any);
    produtosServiceSpy.deleteProduto.and.returnValue(of());

    produtosServiceSpy.getProdutoById.and.returnValue(of({
      id: 1,
      descricao: 'Produto mock',
      custo: 10,
      imagemBase64: ''
    }));

    
    fixture.detectChanges();
  
    component.onDeleteProduto();
  
    tick(); 
  
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(produtosServiceSpy.deleteProduto).toHaveBeenCalledWith(1);


  }));
  

  it('should call produtosLojasService.delete onDeletePreco', () => {
    const preco: PrecoProdutoDto = {
      id: 1, loja: {
        descricao: 'Loja',
        id: 1
      }, precoVenda: 10,
      produtoId: 1
    };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
    dialogSpy.open.and.returnValue(dialogRefSpy);
    produtosLojasServiceSpy.delete.and.returnValue(of());
    spyOn(component, 'loadPrecos');

    component.produto = { id: 123, descricao: '', custo: 0, imagemBase64: '' };
    component.onDeletePreco(preco);

    expect(produtosLojasServiceSpy.delete).toHaveBeenCalledWith(1);
  });
});
