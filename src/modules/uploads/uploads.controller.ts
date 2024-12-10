import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './services/uploads.service';
import { ApiTags } from '@nestjs/swagger';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Invalid file format');
    }
    const url = await this.uploadsService.uploadImage(file);
    return withBaseResponse({
      status: 201,
      message: 'Image uploaded successfully',
      data: url,
    });
  }
}
