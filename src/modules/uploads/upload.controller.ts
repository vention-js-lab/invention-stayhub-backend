import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Invalid file format');
    }
    const url = await this.uploadService.uploadImage(file);
    return withBaseResponse({
      status: 200,
      message: 'Image uploaded successfully',
      data: url,
    });
  }
}
