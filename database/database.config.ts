import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join, resolve } from 'node:path';

config({ path: resolve(join(__dirname, '..', '.env')) });

export const DatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['./migrations/*.ts'],
  synchronize: false,
  migrationsTableName: 'migrations',
};
