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
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
      // region: this.configService.get('MINIO_REGION'),
    });
  }

  getClient(): Client {
    return this.client;
  }
}
