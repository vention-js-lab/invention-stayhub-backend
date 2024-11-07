import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true });
const configService = new ConfigService();

export const AppDataSource = new DataSource(databaseConfig(configService));
