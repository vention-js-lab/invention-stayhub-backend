import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWishlistTable1731320096205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wishlist',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'account_id',
            type: 'uuid',
          },
          {
            name: 'accommodation_id',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['account_id'],
            referencedTableName: 'account',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['accommodation_id'],
            referencedTableName: 'accommodation',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wishlist');
  }
}
