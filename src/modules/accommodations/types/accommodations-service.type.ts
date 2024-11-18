import { AccommodationDto } from '../dto/requests/create-accommodation.req';
import { UpdateAccommodationDto } from '../dto/requests/update-accommodation.req';

export interface CreateAccommodationParams {
  createAccommodationDto: AccommodationDto;
  ownerId: string;
}

export interface UpdateAccommodationParams {
  accommodationId: string;
  ownerId: string;
  updateAccommodationDto: UpdateAccommodationDto;
}
