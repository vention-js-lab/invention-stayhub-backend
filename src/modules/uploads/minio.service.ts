import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { EnvConfig } from '#/shared/configs/env.config';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Client;
  private readonly bucketName = 'uploads';

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.client = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, 'us-east-1');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getClient(): Client {
    return this.client;
  }
}
