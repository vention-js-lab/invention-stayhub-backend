import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateWishlistItemDto {
  @ApiProperty({
    description: 'Accommodation id',
    required: true,
    example: '1bd59221-5e37-4bc5-9b71-6b0e36561677',
  })
  @IsString()
  @IsUUID()
  accommodationId: string;
}
