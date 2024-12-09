import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from './minio.service';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '#/shared/configs/env.config';

@Injectable()
export class UploadsService {
  private readonly bucketName = 'uploads';

  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const protocol = this.configService.get('APP_ENV') === 'production' ? 'https' : 'http';
    const endpoint = this.configService.get('MINIO_ENDPOINT', { infer: true });
    const port = this.configService.get('MINIO_PORT', { infer: true });

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const metaData = { 'Content-Type': file.mimetype };

    try {
      const minioClient = this.minioService.getClient();
      await minioClient.putObject(this.bucketName, fileName, file.buffer, file.size, metaData);
      return `${protocol}://${endpoint}:${port}/${this.bucketName}/${fileName}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      throw new InternalServerErrorException(`Failed to upload image: ${errorMessage}`);
    }
  }
}
