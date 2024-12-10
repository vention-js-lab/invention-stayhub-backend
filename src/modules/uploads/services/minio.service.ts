import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { EnvConfig } from '#/shared/configs/env.config';

@Injectable()
export class MinioService {
  private client: Client;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    this.client = new Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: this.configService.get('MINIO_PORT'),
      useSSL: this.configService.get('APP_ENV') === 'production',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  getClient(): Client {
    return this.client;
  }
}
