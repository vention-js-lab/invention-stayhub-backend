import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class FileUploadService {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error('No file provided or file buffer is empty');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `${fileName}`;

    const { data, error } = await this.supabase.storage
      .from('uploads')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new BadRequestException(error.message);
    }
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');

    return `${supabaseUrl}/storage/v1/object/${data.fullPath}`;
  }
}
