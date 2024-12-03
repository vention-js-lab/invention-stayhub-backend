import { type AccommodationDto } from '../dto/requests/create-accommodation.req';
import { type UpdateAccommodationDto } from '../dto/requests/update-accommodation.req';

export interface CreateAccommodationParams {
  createAccommodationDto: AccommodationDto;
  ownerId: string;
}

export interface UpdateAccommodationParams {
  accommodationId: string;
  ownerId: string;
  updateAccommodationDto: UpdateAccommodationDto;
}
