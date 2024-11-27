import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateWishlistItemDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Accommodation id',
    required: true,
  })
  @IsString()
  @IsUUID()
  accommodationId: string;
}
