import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddedDeletedatToAccount1732515808866
  implements MigrationInterface
{
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('account', 'deleted_at');
  }
}
