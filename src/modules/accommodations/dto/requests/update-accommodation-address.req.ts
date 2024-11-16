import { PartialType } from '@nestjs/swagger';
import { AccommodationAddressDto } from './create-accommodation-address.req';

export class UpdateAccommodationAddressDto extends PartialType(
  AccommodationAddressDto,
) {}
