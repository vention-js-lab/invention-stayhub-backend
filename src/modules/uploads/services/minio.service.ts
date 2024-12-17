import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { EnvConfig } from '#/shared/configs/env.config';

@Injectable()
export class MinioService {
  private client: Client;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {
    const config = {
      endPoint: this.configService.get('CLOUDFLARE_ENDPOINT'),
      port: this.configService.get('CLOUDFLARE_PORT'),
      useSSL: this.configService.get('CLOUDFLARE_USE_SSL'),
      accessKey: this.configService.get('CLOUDFLARE_ROOT_USER'),
      secretKey: this.configService.get('CLOUDFLARE_ROOT_PASSWORD'),
    };

    this.client = new Client(config);
  }

  getClient(): Client {
    return this.client;
  }
}
