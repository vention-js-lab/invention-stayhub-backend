import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateAccommodationTable1731154775882
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accommodation', 'user_id');

    await queryRunner.addColumn(
      'accommodation',
      new TableColumn({
        name: 'owner_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'accommodation',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('accommodation');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('owner_id') !== -1,
    );
    await queryRunner.dropForeignKey('accommodation', foreignKey);

    await queryRunner.dropColumn('accommodation', 'owner_id');

    await queryRunner.addColumn(
      'accommodation',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
