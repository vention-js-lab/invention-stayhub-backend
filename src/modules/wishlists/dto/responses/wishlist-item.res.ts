import { ApiProperty } from '@nestjs/swagger';

export class WishlistResDto {
  @ApiProperty({ example: '1bd59221-5e37-4bc5-9b71-6b0e36561677' })
  id: string;

  @ApiProperty({ example: '1bd59221-5e37-4bc5-9b71-6b0e36561677' })
  accountId: string;

  @ApiProperty({ example: '1bd59221-5e37-4bc5-9b71-6b0e36561677' })
  accommodationId: string;

  @ApiProperty({ example: '2024-11-19T20:40:30.518Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-19T20:40:30.518Z' })
  updatedAt: string;
}
