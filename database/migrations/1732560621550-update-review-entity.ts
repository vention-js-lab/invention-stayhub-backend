import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateReviewEntity1732560621550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('review');
    const dropForeignKey = async (columnName: string) => {
      const foreignKey = table?.foreignKeys.find((fk) =>
        fk.columnNames.includes(columnName),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('review', foreignKey);
      }
    };

    await dropForeignKey('accommodation_id');
    await dropForeignKey('account_id');
    await dropForeignKey('booking_id');

    await queryRunner.changeColumn(
      'review',
      'accommodation_id',
      new TableColumn({
        name: 'accommodation_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'review',
      'account_id',
      new TableColumn({
        name: 'account_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'review',
      'booking_id',
      new TableColumn({
        name: 'booking_id',
        type: 'uuid',
        isNullable: false,
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
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'account',
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
    const table = await queryRunner.getTable('review');

    const dropForeignKey = async (columnName: string) => {
      const foreignKey = table?.foreignKeys.find((fk) =>
        fk.columnNames.includes(columnName),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('review', foreignKey);
      }
    };

    await dropForeignKey('accommodation_id');
    await dropForeignKey('account_id');
    await dropForeignKey('booking_id');

    await queryRunner.changeColumn(
      'review',
      'accommodation_id',
      new TableColumn({
        name: 'accommodation_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'review',
      'account_id',
      new TableColumn({
        name: 'account_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'review',
      'booking_id',
      new TableColumn({
        name: 'booking_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['accommodation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accommodation',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'account',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'review',
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'booking',
        onDelete: 'SET NULL',
      }),
    );
  }
}
