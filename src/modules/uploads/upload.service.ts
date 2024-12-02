import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from './minio.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly bucketName = 'uploads';

  constructor(private readonly minioService: MinioService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const metaData = { 'Content-Type': file.mimetype };

    try {
      const minioClient = this.minioService.getClient();
      await minioClient.putObject(this.bucketName, fileName, file.buffer, file.size, metaData);
      return `http://localhost:9001/${this.bucketName}/${fileName}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      throw new InternalServerErrorException(`Failed to upload image: ${errorMessage}`);
    }
  }
}
