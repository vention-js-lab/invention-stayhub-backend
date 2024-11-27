import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FixedAccountTable1732515808866 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'account',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.dropColumn('account', 'is_deleted');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'account',
      new TableColumn({
        name: 'is_deleted',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );

    await queryRunner.dropColumn('account', 'deleted_at');
  }
}
