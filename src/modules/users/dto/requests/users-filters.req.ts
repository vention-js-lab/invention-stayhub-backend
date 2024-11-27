import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TransformToBoolean } from '#/shared/transformers/transform-type.transformer';
import { Roles } from '#/shared/constants/user-roles.constant';
import { Gender } from '#/shared/constants/gender.constant';
import { PaginationQueryDto } from '#/shared/dto/pagination-query.req';

export class UserFiltersReqQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Search by first name, last name, phone number',
    required: false,
    type: String,
    format: 'email',
  })
  @IsOptional()
  @IsString()
  search: string | undefined;

  @ApiProperty({
    description: 'Filter user phone number',
    required: false,
    type: String,
    example: '+14155552671',
  })
  @IsOptional()
  @IsString()
  phoneNumber: string | undefined;

  @ApiProperty({
    description: 'Filter by user country',
    required: false,
    type: String,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  country: string | undefined;

  @ApiProperty({
    description: 'Filter by gender',
    required: false,
    example: 'male',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Gender)
  gender: Gender | undefined;

  @ApiProperty({
    description: 'Filter by user deleted status',
    required: false,
    type: Boolean,
    format: 'boolean',
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isDeleted: boolean | undefined;

  @ApiProperty({
    description: 'Filter by roles',
    required: false,
    example: 'user',
  })
  @IsOptional()
  @IsString()
  @IsEnum(Roles)
  role: Roles | undefined;
}
