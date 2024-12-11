import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccommodationCategoryJointTable1733832599964 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accommodation_category',
        columns: [
          {
            name: 'accommodation_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['accommodation_id'],
            referencedTableName: 'accommodation',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['category_id'],
            referencedTableName: 'category',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accommodation_category');
  }
}
