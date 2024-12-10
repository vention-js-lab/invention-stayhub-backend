import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env') });

const DataSourceConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['./dist/database/migrations/*'],
  synchronize: false,
  migrationsTableName: 'migrations',
  uuidExtension: 'uuid-ossp',
});

export default DataSourceConfig;
