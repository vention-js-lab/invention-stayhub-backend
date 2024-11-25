import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadataDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: true, description: 'Does response have a next page' })
  hasNextPage: boolean;

  @ApiProperty({
    example: true,
    description: 'Does response have a previous page',
  })
  hasPreviousPage: boolean;

  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;
}
