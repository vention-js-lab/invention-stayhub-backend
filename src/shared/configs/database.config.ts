import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const databaseConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  entities: [join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  synchronize: true,
});
