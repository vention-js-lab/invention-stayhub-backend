import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateAccommodationAddressTable1731488129790
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accommodation_address',
      'street',
      new TableColumn({
        name: 'street',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'city',
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'country',
      new TableColumn({
        name: 'country',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'zip_code',
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'latitude',
      new TableColumn({
        name: 'latitude',
        type: 'decimal',
        precision: 10,
        scale: 6,
        isNullable: true,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'longitude',
      new TableColumn({
        name: 'longitude',
        type: 'decimal',
        precision: 10,
        scale: 6,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'accommodation_address',
      'street',
      new TableColumn({
        name: 'street',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'city',
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'country',
      new TableColumn({
        name: 'country',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'zip_code',
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'latitude',
      new TableColumn({
        name: 'latitude',
        type: 'decimal',
        precision: 10,
        scale: 6,
        isNullable: false,
      }),
    );

    await queryRunner.changeColumn(
      'accommodation_address',
      'longitude',
      new TableColumn({
        name: 'longitude',
        type: 'decimal',
        precision: 10,
        scale: 6,
        isNullable: false,
      }),
    );
  }
}
