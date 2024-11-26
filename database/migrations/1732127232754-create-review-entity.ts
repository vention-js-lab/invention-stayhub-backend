import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateReviewEntity1732127232754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'review',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'accommodation_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'booking_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'account',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['accommodation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accommodation',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'booking',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('review');
  }
}
