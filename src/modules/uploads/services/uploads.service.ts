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
    const url = this.configService.get<string>('CLOUDFLARE_IMAGE_URL', { infer: true });

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const metaData = { 'Content-Type': file.mimetype };

    try {
      const minioClient = this.minioService.getClient();
      await minioClient.putObject(this.bucketName, fileName, file.buffer, file.size, metaData);
      return `${url}/${fileName}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      throw new InternalServerErrorException(`Failed to upload image: ${errorMessage}`);
    }
  }
}
