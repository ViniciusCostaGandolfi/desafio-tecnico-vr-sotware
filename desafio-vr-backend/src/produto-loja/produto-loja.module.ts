import { Module } from '@nestjs/common';
import { ProdutoLojaController } from './controller/produto-loja.controller';
import { ProdutoLojaService } from './service/produto-loja.service';
import { ProdutoLoja } from './entities/produto-loja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniquePrecoLojaValidator } from './validators/unique-preco-loja';


@Module({
  imports: [TypeOrmModule.forFeature([ProdutoLoja])],
  controllers: [ProdutoLojaController],
  providers: [ProdutoLojaService, UniquePrecoLojaValidator],
})
export class ProdutoLojaModule {}
