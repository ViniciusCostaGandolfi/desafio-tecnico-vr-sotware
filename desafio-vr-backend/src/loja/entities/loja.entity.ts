import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProdutoLoja } from '../../produto-loja/entities/produto-loja.entity';

@Entity()
export class Loja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  descricao: string;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.loja, {
    cascade: true
  })
  precos: ProdutoLoja[];
}
