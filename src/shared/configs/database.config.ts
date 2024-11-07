import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { EnvConfig } from './env.config';
import { User } from '../../modules/user/entities/user.entity';

export const databaseConfig = (
  configService: ConfigService<EnvConfig>,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User],
  synchronize: false,
});
