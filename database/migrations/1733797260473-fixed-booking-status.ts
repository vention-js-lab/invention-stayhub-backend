import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedBookingStatus1733797260473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE "booking_status_enum"
      ADD VALUE 'cancelled';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "booking_status_enum_new" AS ENUM ('active', 'inactive', 'pending', 'completed', 'upcoming');
    `);

    await queryRunner.query(`
      ALTER TABLE "booking"
      ALTER COLUMN "status" TYPE "booking_status_enum_new" USING "status"::text::"booking_status_enum_new";
    `);

    await queryRunner.query(`
      DROP TYPE "booking_status_enum";
    `);

    await queryRunner.query(`
      ALTER TYPE "booking_status_enum_new" RENAME TO "booking_status_enum";
    `);
  }
}
