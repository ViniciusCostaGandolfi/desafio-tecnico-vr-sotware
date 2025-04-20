import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';
import { Loja } from '../../loja/entities/loja.entity';

@Entity()
@Unique(['produto', 'loja'])
export class ProdutoLoja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, (produto) => produto.precos, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'produtoId' })
  produto: Produto;

  @ManyToOne(() => Loja, (loja) => loja.precos, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'lojaId' })
  loja: Loja;

  @Column('numeric', { precision: 13, scale: 3 })
  precoVenda: number;
}
