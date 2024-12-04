import { MigrationInterface, QueryRunner, TableColumn, TableUnique } from 'typeorm';

export class UpdatePaymentTable1732704196501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payment');

    if (!table) {
      throw new Error("Table 'payment' does not exist. Cannot update transaction_id column.");
    }

    const transactionIdColumn = table.findColumnByName('transaction_id');

    if (!transactionIdColumn) {
      throw new Error("Column 'transaction_id' does not exist in 'payment' table. Cannot update column type.");
    }

    await queryRunner.changeColumn(
      'payment',
      'transaction_id',
      new TableColumn({
        name: 'transaction_id',
        type: 'varchar',
        isNullable: transactionIdColumn.isNullable,
        isUnique: transactionIdColumn.isUnique,
      }),
    );

    const bookingIdColumn = table.findColumnByName('booking_id');

    if (!bookingIdColumn) {
      throw new Error("Column 'booking_id' does not exist in 'payment' table. Cannot update column to be non-nullable.");
    }

    await queryRunner.changeColumn(
      'payment',
      'booking_id',
      new TableColumn({
        name: 'booking_id',
        type: bookingIdColumn.type,
        isNullable: false,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payment');

    if (!table) {
      throw new Error("Table 'payment' does not exist. Cannot revert transaction_id column.");
    }

    const transactionIdColumn = table.findColumnByName('transaction_id');
    if (!transactionIdColumn) {
      throw new Error("Column 'transaction_id' does not exist in 'payment' table. Cannot revert column type.");
    }

    await queryRunner.changeColumn(
      'payment',
      'transaction_id',
      new TableColumn({
        name: 'transaction_id',
        type: 'uuid',
        isNullable: transactionIdColumn.isNullable,
        isUnique: transactionIdColumn.isUnique,
      }),
    );

    const bookingIdColumn = table.findColumnByName('booking_id');

    if (!bookingIdColumn) {
      throw new Error("Column 'booking_id' does not exist in 'payment' table. Cannot revert column to nullable.");
    }

    await queryRunner.changeColumn(
      'payment',
      'booking_id',
      new TableColumn({
        name: 'booking_id',
        type: bookingIdColumn.type,
        isNullable: true,
        isUnique: false,
      }),
    );
  }
}
