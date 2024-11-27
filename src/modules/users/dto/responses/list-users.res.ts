import { ApiProperty } from '@nestjs/swagger';
import { UserResDto } from './account.res';
import { PaginationMetadataDto } from '#/modules/users/dto/responses/pagination-metadata.dto';

export class ListUsersResponseDto {
  @ApiProperty({ type: [UserResDto], description: 'List of users' })
  result: UserResDto[];

  @ApiProperty({
    type: PaginationMetadataDto,
    description: 'Pagination metadata',
  })
  metadata: PaginationMetadataDto;
}
