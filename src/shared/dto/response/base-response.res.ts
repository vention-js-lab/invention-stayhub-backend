import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({
    description: 'HTTP status code',
  })
  status: number;

  @ApiProperty({
    description: 'Response message',
  })
  message: string;
}
