import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeletedAtToAccommodation1731928957503
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accommodation',
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accommodation', 'deleted_at');
  }
}
