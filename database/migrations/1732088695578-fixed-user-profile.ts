import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedUserProfile1732088695578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE profile
            ALTER COLUMN country DROP NOT NULL;
        `);
    await queryRunner.query(`
            ALTER TABLE profile
            ALTER COLUMN description DROP NOT NULL;
        `);
    await queryRunner.query(`
            ALTER TABLE profile
            ALTER COLUMN phone_number DROP NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE profile
            ALTER COLUMN country SET NOT NULL;
        `);
    await queryRunner.query(`
            ALTER TABLE profile
            ALTER COLUMN description SET NOT NULL;
        `);
    await queryRunner.query(`
            ALTER TABLE profile
            ALTER COLUMN phone_number SET NOT NULL;
        `);
  }
}
