import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAccommodationAmenityTable1731152706420
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accommodation_amenity',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'has_wifi', type: 'boolean', default: false },
          { name: 'has_parking', type: 'boolean', default: false },

          { name: 'has_swimming_pool', type: 'boolean', default: false },
          { name: 'has_pet_allowance', type: 'boolean', default: false },
          { name: 'has_backyard', type: 'boolean', default: false },
          { name: 'has_smoking_allowance', type: 'boolean', default: false },
          { name: 'has_hospital_nearby', type: 'boolean', default: false },
          { name: 'has_laundry_service', type: 'boolean', default: false },
          { name: 'has_kitchen', type: 'boolean', default: false },
          { name: 'has_air_conditioning', type: 'boolean', default: false },
          { name: 'has_tv', type: 'boolean', default: false },
          { name: 'has_airport_transfer', type: 'boolean', default: false },
          { name: 'is_close_to_center', type: 'boolean', default: false },
          { name: 'is_child_friendly', type: 'boolean', default: false },
          { name: 'is_quiet_area', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accommodation_amenity');
  }
}
