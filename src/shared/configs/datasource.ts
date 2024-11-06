import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true })],
  providers: [ConfigService],
})
export class DataSourceModule {}

const configService = new ConfigService();

export const AppDataSource = new DataSource(databaseConfig(configService));
