import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './services/uploads.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File | undefined): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Invalid file format');
    }
    const url = await this.uploadsService.uploadImage(file);
    return { url };
  }
}
