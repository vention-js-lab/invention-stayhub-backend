import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from './minio.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly bucketName = 'uploads';

  constructor(private readonly minioService: MinioService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file?.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const metaData = { 'Content-Type': file.mimetype };

    try {
      const minioClient = this.minioService.getClient();
      await minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );
      return `http://localhost:9001/${this.bucketName}/${fileName}`;
    } catch (error) {
      throw new HttpException(
        `Failed to upload image: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
