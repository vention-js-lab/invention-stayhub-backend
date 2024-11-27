import { ProfilePartialResDto } from './profile.res';
import { ApiProperty } from '@nestjs/swagger';

export class UserResDto {
  @ApiProperty({
    description: 'User account id',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    format: 'email',
  })
  email: string;

  @ApiProperty({ description: 'User role', example: 'admin' })
  role: string;

  @ApiProperty({ description: 'Account created date', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: 'Account updated date', format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ description: 'Account deleted date', format: 'date-time' })
  deletedAt: string;

  @ApiProperty({ type: ProfilePartialResDto })
  profile: ProfilePartialResDto;
}
