import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProdutosListPageComponent } from './produtos-list-page.component';
import { ProdutosService } from '../../core/services/produtos/produtos.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NumberFormatService } from '../../core/services/number-format/number-format.service';

describe('ProdutosListPageComponent', () => {
  let component: ProdutosListPageComponent;
  let fixture: ComponentFixture<ProdutosListPageComponent>;
  let produtosServiceSpy: jasmine.SpyObj<ProdutosService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;
  let numberFormatSpy: jasmine.SpyObj<NumberFormatService>;

  beforeEach(async () => {
    const produtosServiceMock = jasmine.createSpyObj('ProdutosService', ['getAllProdutos', 'deleteProduto']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const numberFormatMock = jasmine.createSpyObj('NumberFormatService', ['stringToNumber']);

    await TestBed.configureTestingModule({
      imports: [ProdutosListPageComponent],
      providers: [
        { provide: ProdutosService, useValue: produtosServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
        { provide: NumberFormatService, useValue: numberFormatMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutosListPageComponent);
    component = fixture.componentInstance;

    produtosServiceSpy = TestBed.inject(ProdutosService) as jasmine.SpyObj<ProdutosService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    numberFormatSpy = TestBed.inject(NumberFormatService) as jasmine.SpyObj<NumberFormatService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load produtos on init', () => {
    produtosServiceSpy.getAllProdutos.and.returnValue(of({ data: [], totalCount: 0, pageSize: 10, pageIndex: 0, totalPages: 0, hasNext: false, hasPrevious: false }));
    component.ngOnInit();
    expect(produtosServiceSpy.getAllProdutos).toHaveBeenCalled();
  });

  it('should navigate to cadastro onAdd', () => {
    component.onAdd();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/produtos/cadastro']);
  });

  it('should navigate to editar produto onEdit', () => {
    component.onEdit(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/produtos/cadastro/', 1]);
  });

  it('should open dialog and call deleteProduto on confirm', fakeAsync(() => {
    const produtoId = 1;
  
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);
  
    produtosServiceSpy.deleteProduto.and.returnValue(of());
  
    component.onDelete(produtoId);
    tick(); 
  
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(produtosServiceSpy.deleteProduto).toHaveBeenCalledWith(produtoId);
  }));
  
  
  

  it('should handle error on loadProdutos', () => {
    produtosServiceSpy.getAllProdutos.and.returnValue(throwError(() => ({
      error: { message: 'Erro de teste' }
    })));
    component.loadProdutos();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Erro de teste', 'fechar', jasmine.any(Object));
  });
});
