import { Module } from '@nestjs/common';
import { FileUploadController } from './upload.controller';
import { FileUploadService } from './upload.service';

@Module({
  providers: [FileUploadService],
  controllers: [FileUploadController],
})
export class UploadModule {}
