import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { ParseInt } from '#/shared/transformers/parse-int.transformer';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number | undefined;

  @ApiProperty({
    description: 'Limit of items per page for pagination',
    required: false,
    example: 10,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit: number | undefined;
}
