import { MigrationInterface, QueryRunner } from "typeorm";

export class V1InitDb1744818532184 implements MigrationInterface {
  name = 'V1InitDb1744818532184'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "loja" (
        "id" SERIAL NOT NULL,
        "descricao" character varying(60) NOT NULL,
        CONSTRAINT "PK_loja_id" PRIMARY KEY ("id")
      )`);

    await queryRunner.query(`
      CREATE TABLE "produto" (
        "id" SERIAL NOT NULL,
        "descricao" character varying(60) NOT NULL,
        "custo" numeric(13,3),
        "imagem" bytea,
        CONSTRAINT "PK_produto_id" PRIMARY KEY ("id")
      )`);

    await queryRunner.query(`
      CREATE TABLE "produto_loja" (
        "id" SERIAL NOT NULL,
        "precoVenda" numeric(13,3) NOT NULL,
        "produtoId" integer,
        "lojaId" integer,
        CONSTRAINT "UQ_produto_loja_produto_loja" UNIQUE ("produtoId", "lojaId"),
        CONSTRAINT "PK_produto_loja_id" PRIMARY KEY ("id")
      )`);

    await queryRunner.query(`
      ALTER TABLE "produto_loja"
      ADD CONSTRAINT "FK_produto_loja_produto_id"
      FOREIGN KEY ("produtoId") REFERENCES "produto"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION`);

    await queryRunner.query(`
      ALTER TABLE "produto_loja"
      ADD CONSTRAINT "FK_produto_loja_loja_id"
      FOREIGN KEY ("lojaId") REFERENCES "loja"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "produto_loja" DROP CONSTRAINT "FK_produto_loja_loja_id"`);
    await queryRunner.query(`ALTER TABLE "produto_loja" DROP CONSTRAINT "FK_produto_loja_produto_id"`);
    await queryRunner.query(`DROP TABLE "produto_loja"`);
    await queryRunner.query(`DROP TABLE "produto"`);
    await queryRunner.query(`DROP TABLE "loja"`);
  }
}
