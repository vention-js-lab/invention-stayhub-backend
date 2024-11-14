import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { AccommodationFiltersQueryDto } from '../dto/accomodation-filters.dto';
import { Repository } from 'typeorm';
import {
  addPriceFilters,
  addAvailabilityFilters,
  addAmenityFilters,
  addSearchFilters,
  addApartmentFilters,
} from '../helpers/accomodation-filters.util';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepo: Repository<Accommodation>,
  ) {}

  create() {
    return 'This action adds a new Accommodation';
  }

  async getAllAccommodations(filters: AccommodationFiltersQueryDto) {
    const queryBuilder = this.accommodationRepo
      .createQueryBuilder('accommodation')
      .leftJoinAndSelect('accommodation.address', 'address')
      .leftJoinAndSelect('accommodation.amenity', 'amenity')
      .leftJoinAndSelect('accommodation.images', 'image');

    addPriceFilters(queryBuilder, filters);
    addAvailabilityFilters(queryBuilder, filters);
    addSearchFilters(queryBuilder, filters);
    addApartmentFilters(queryBuilder, filters);
    addAmenityFilters(queryBuilder, filters);

    const accomodations = await queryBuilder.getMany();
    return accomodations;
  }

  findOne() {
    return `This action returns Accommodation`;
  }

  update() {
    return `This action updates Accommodation`;
  }

  remove() {
    return `This action removes Accommodation`;
  }
}
