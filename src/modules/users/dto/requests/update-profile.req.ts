import { IsOptional, IsString, IsEnum, IsPhoneNumber } from 'class-validator';
import { Gender } from '#/shared/constants/gender.constant';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Changing user first name',
    required: false,
    example: 'Someone',
  })
  @IsOptional()
  @IsString()
  firstName: string | undefined;

  @ApiPropertyOptional({
    description: 'Changing user last name',
    required: false,
    example: 'Someone',
  })
  @IsOptional()
  @IsString()
  lastName: string | undefined;

  @ApiPropertyOptional({
    description: 'Changing user gender',
    required: false,
    example: 'male',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender | undefined;

  @ApiPropertyOptional({
    description: 'Changing user country',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  country: string | undefined;

  @ApiPropertyOptional({
    description: 'Changing user profile description',
    required: false,
    example: 'Some long long text',
  })
  @IsOptional()
  @IsString()
  description: string | undefined;

  @ApiPropertyOptional({
    description: 'Changing phone number',
    required: false,
    example: '+998 90 123 45 67',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string | undefined;
}
