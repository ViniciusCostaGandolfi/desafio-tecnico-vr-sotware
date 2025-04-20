import { Module } from '@nestjs/common';
import { LojaController } from './controller/loja.controller';
import { LojaService } from './service/loja.service';
import { Loja } from './entities/loja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Loja])],
  controllers: [LojaController],
  providers: [LojaService],
})
export class LojaModule {}
