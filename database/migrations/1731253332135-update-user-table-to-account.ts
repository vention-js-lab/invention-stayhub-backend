import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserTable1731253332135 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE IF EXISTS account_role_enum');
    await queryRunner.renameTable('user', 'account');
    await queryRunner.dropColumns('account', ['first_name', 'last_name']);

    await queryRunner.addColumns('account', [
      new TableColumn({
        name: 'is_deleted',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
      new TableColumn({
        name: 'type',
        type: 'enum',
        enum: ['manual', 'google'],
        isNullable: false,
        default: `'manual'`,
      }),
      new TableColumn({
        name: 'google_id',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('account', 'user');

    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
        isNullable: true,
      }),
    ]);

    await queryRunner.dropColumns('user', ['is_deleted', 'type', 'google_id']);

    await queryRunner.query(`
      CREATE TYPE account_role_enum AS ENUM ('user', 'admin'); 
    `);

    await queryRunner.changeColumn(
      'user',
      'role',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: ['user', 'admin'],
        isNullable: false,
      }),
    );
  }
}
