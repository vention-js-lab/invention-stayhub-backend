import { ApiProperty } from '@nestjs/swagger';

export class WishlistResDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Unique identifier for the wishlist',
  })
  id: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Unique identifier for the associated account',
  })
  accountId: string;

  @ApiProperty({
    format: 'uuid',
    description: 'Unique identifier for the associated accommodation',
  })
  accommodationId: string;

  @ApiProperty({
    format: 'date-time',
    description: 'Date and time when the wishlist was created',
  })
  createdAt: string;

  @ApiProperty({
    format: 'date-time',
    description: 'Date and time when the wishlist was last updated',
  })
  updatedAt: string;
}
