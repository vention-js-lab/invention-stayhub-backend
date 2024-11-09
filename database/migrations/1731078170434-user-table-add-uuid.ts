import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserTableAddUuid1731078170434 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        default: 'uuid_generate_v4()',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      }),
    );
  }
}
