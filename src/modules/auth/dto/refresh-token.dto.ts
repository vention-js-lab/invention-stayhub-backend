import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token containing user ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
