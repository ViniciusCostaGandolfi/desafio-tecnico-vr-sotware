import { MigrationInterface, QueryRunner } from "typeorm";

export class V2_populateDb1744892632152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO loja (descricao) VALUES
      ('Loja 01 - Centro'),
      ('Loja 02 - Jardim'),
      ('Loja 03 - Sul'),
      ('Loja 04 - Norte'),
      ('Loja 05 - Leste'),
      ('Loja 06 - Oeste'),
      ('Loja 07 - Shopping'),
      ('Loja 08 - Aeroporto'),
      ('Loja 09 - Vila Nova'),
      ('Loja 10 - Industrial');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM loja
      WHERE descricao IN (
        'Loja 01 - Centro',
        'Loja 02 - Jardim',
        'Loja 03 - Sul',
        'Loja 04 - Norte',
        'Loja 05 - Leste',
        'Loja 06 - Oeste',
        'Loja 07 - Shopping',
        'Loja 08 - Aeroporto',
        'Loja 09 - Vila Nova',
        'Loja 10 - Industrial'
      );
    `);
  }
}
