import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProdutoLoja } from '../../produto-loja/entities/produto-loja.entity';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  descricao: string;

  @Column('numeric', { precision: 13, scale: 3, nullable: true })
  custo: number;

  @Column({ type: 'bytea', nullable: true })
  imagem: Buffer | null;

  @OneToMany(() => ProdutoLoja, (produtoLoja) => produtoLoja.produto, {
    cascade: true,
  })
  precos: ProdutoLoja[];
}
