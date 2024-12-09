import { type AccommodationDto } from '../dto/request/create-accommodation.req';
import { type UpdateAccommodationDto } from '../dto/request/update-accommodation.req';

export interface CreateAccommodationParams {
  createAccommodationDto: AccommodationDto;
  ownerId: string;
}

export interface UpdateAccommodationParams {
  accommodationId: string;
  ownerId: string;
  updateAccommodationDto: UpdateAccommodationDto;
}
