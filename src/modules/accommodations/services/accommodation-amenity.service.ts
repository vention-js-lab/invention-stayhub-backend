import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { AccommodationAmenityDto } from '#/modules/accommodations/dto/requests/create-accommodation-amenity.req';

@Injectable()
export class AccommodationAmenityService {
  constructor(
    @InjectRepository(AccommodationAmenity)
    private accommodationAmenityRepository: Repository<AccommodationAmenity>,
  ) {}

  async create(
    accommodationId: string,
    createAccommodationAmenityDto: AccommodationAmenityDto,
  ): Promise<AccommodationAmenity> {
    const newAccommodationAmenity = this.accommodationAmenityRepository.create({
      accommodationId,
      ...createAccommodationAmenityDto,
    });

    const createdAccommodationAmenity =
      await this.accommodationAmenityRepository.save(newAccommodationAmenity);

    return createdAccommodationAmenity;
  }
}
