import { IsString, IsUUID } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsUUID('4', { message: 'Accommodation ID must be a valid UUID v4' })
  accommodationId: string;
}
