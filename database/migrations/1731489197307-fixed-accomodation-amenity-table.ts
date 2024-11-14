import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class FixedAccomodationAmenityTable1731489197307
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'accommodation_amenity',
      new TableColumn({
        name: 'accommodation_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'accommodation_amenity',
      new TableForeignKey({
        columnNames: ['accommodation_id'],
        referencedTableName: 'accommodation',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('accommodation_amenity');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('accommodation_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('accommodation_amenity', foreignKey);
    }
    await queryRunner.dropColumn('accommodation_amenity', 'accommodation_id');
  }
}
