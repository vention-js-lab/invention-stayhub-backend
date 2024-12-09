import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { AccommodationAmenityDto } from '#/modules/accommodations/dto/request/create-accommodation-amenity.req';

@Injectable()
export class AccommodationAmenityService {
  constructor(
    @InjectRepository(AccommodationAmenity)
    private accommodationAmenityRepository: Repository<AccommodationAmenity>,
  ) {}

  async create(accommodationId: string, createAccommodationAmenityDto: AccommodationAmenityDto): Promise<AccommodationAmenity> {
    const newAccommodationAmenity = this.accommodationAmenityRepository.create({
      ...createAccommodationAmenityDto,
      accommodationId,
    });

    const createdAccommodationAmenity = await this.accommodationAmenityRepository.save(newAccommodationAmenity);

    return createdAccommodationAmenity;
  }

  async update(accommodationAmenityId: string, updateAccommodationAmenityDto: AccommodationAmenityDto) {
    await this.accommodationAmenityRepository.update(accommodationAmenityId, updateAccommodationAmenityDto);

    return await this.accommodationAmenityRepository.findOne({
      where: { id: accommodationAmenityId },
    });
  }
}
