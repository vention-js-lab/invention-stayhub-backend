import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './services/uploads.service';
import { MinioService } from './services/minio.service';

@Module({
  providers: [UploadsService, MinioService],
  controllers: [UploadsController],
  exports: [UploadsService],
})
export class UploadsModule {}
