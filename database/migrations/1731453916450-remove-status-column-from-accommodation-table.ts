import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveStatusColumnFromAccommodationTable1731453916450
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accommodation', 'status');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accommodation',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        default: "'available'",
      }),
    );
  }
}
