import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AccommodationsTableUuidFix1731098793269
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accommodation',
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
