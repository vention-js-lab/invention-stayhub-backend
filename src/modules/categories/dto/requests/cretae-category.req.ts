import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MinLength } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Icon of the category' })
  @IsString()
  @IsUrl()
  icon: string;
}
