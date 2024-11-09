import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateAccommodationTable1731152414847
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('accommodation', [
      new TableColumn({
        name: 'cover_image',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'available',
        type: 'boolean',
        default: true,
      }),
      new TableColumn({
        name: 'available_from',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'available_to',
        type: 'date',
        isNullable: true,
      }),
      new TableColumn({
        name: 'square_meters',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'number_of_rooms',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'allowed_number_of_people',
        type: 'int',
        isNullable: true,
      }),
    ]);
    await queryRunner.changeColumn(
      'accommodation',
      'price_per_night',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        precision: 10,
        scale: 2,
      }),
    );

    await queryRunner.dropColumn('accommodation', 'location');
    await queryRunner.dropColumn('accommodation', 'amenities');
    await queryRunner.dropColumn('accommodation', 'type');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('accommodation', 'cover_image');
    await queryRunner.dropColumn('accommodation', 'available');
    await queryRunner.dropColumn('accommodation', 'available_from');
    await queryRunner.dropColumn('accommodation', 'available_to');
    await queryRunner.dropColumn('accommodation', 'square_meters');
    await queryRunner.dropColumn('accommodation', 'number_of_rooms');
    await queryRunner.dropColumn('accommodation', 'allowed_number_of_people');

    await queryRunner.changeColumn(
      'accommodation',
      'price',
      new TableColumn({
        name: 'price_per_night',
        type: 'decimal',
        precision: 10,
        scale: 2,
      }),
    );

    await queryRunner.addColumns('accommodation', [
      new TableColumn({
        name: 'location',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'amenities',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'type',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }
}
