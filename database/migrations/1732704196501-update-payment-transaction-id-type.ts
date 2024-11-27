import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdatePaymentTransactionIdType1732704196501
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payment');

    if (!table) {
      throw new Error(
        "Table 'payment' does not exist. Cannot update transaction_id column.",
      );
    }

    const transactionIdColumn = table.findColumnByName('transaction_id');

    if (!transactionIdColumn) {
      throw new Error(
        "Column 'transaction_id' does not exist in 'payment' table. Cannot update column type.",
      );
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payment');

    if (!table) {
      throw new Error(
        "Table 'payment' does not exist. Cannot revert transaction_id column.",
      );
    }

    const transactionIdColumn = table.findColumnByName('transaction_id');
    if (!transactionIdColumn) {
      throw new Error(
        "Column 'transaction_id' does not exist in 'payment' table. Cannot revert column type.",
      );
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
  }
}
