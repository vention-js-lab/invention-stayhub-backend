import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MinioService } from './minio.service';

@Module({
  providers: [UploadService, MinioService],
  controllers: [UploadController],
})
export class UploadModule {}
