import { ProfilePartialResDto } from './profile.res';
import { ApiProperty } from '@nestjs/swagger';

export class UserResDto {
  @ApiProperty({ example: '1bd59221-5e37-4bc5-9b71-6b0e36561677' })
  id: string;

  @ApiProperty({ example: 'user7@example.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;

  @ApiProperty({ example: true })
  isDeleted: boolean;

  @ApiProperty({ example: '2024-11-19T20:40:30.518Z' })
  createdAt: string;

  @ApiProperty({ type: ProfilePartialResDto })
  profile: ProfilePartialResDto;
}
