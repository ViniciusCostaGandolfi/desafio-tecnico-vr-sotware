import { Module } from '@nestjs/common';
import { ProdutoController } from './controller/produto.controller';
import { ProdutoService } from './service/produto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoLoja } from '../produto-loja/entities/produto-loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, ProdutoLoja])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}
