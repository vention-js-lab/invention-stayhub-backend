import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';
import { AccommodationAddressService } from './accommodation-address.service';
import { AccommodationAmenityService } from './accommodation-amenity.service';
import { AccommodationImageService } from './accommodation-image.service';
import { AccommodationFiltersQueryDto } from '#/modules/accommodations/dto/requests/accommodation-filters.dto';

import {
  addPriceFilters,
  addAvailabilityFilters,
  addAmenityFilters,
  addSearchFilters,
  addApartmentFilters,
} from '../helpers/accommodation-filters.util';

interface CreateAccommodationParams {
  createAccommodationDto: AccommodationDto;
  ownerId: string;
}

@Injectable()
export class AccommodationService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
    private accommodationAddressService: AccommodationAddressService,
    private accommodationAmenityService: AccommodationAmenityService,
    private accommodationImageService: AccommodationImageService,
  ) {}

  async create({
    createAccommodationDto,
    ownerId,
  }: CreateAccommodationParams): Promise<Accommodation> {
    const accommodation = this.accommodationRepository.create({
      ...createAccommodationDto,
      ownerId,
    });
    const createdAccommodation =
      await this.accommodationRepository.save(accommodation);

    await this.accommodationAddressService.create(
      createdAccommodation.id,
      createAccommodationDto.address,
    );

    await this.accommodationAmenityService.create(
      createdAccommodation.id,
      createAccommodationDto.amenity,
    );

    await this.accommodationImageService.create(
      createdAccommodation.id,
      createAccommodationDto.images,
    );

    return this.accommodationRepository.findOne({
      where: { id: createdAccommodation.id },
      relations: ['address', 'amenity', 'images'],
    });
  }

  async listAccommodations(filters: AccommodationFiltersQueryDto) {
    const queryBuilder = this.accommodationRepository
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

  async getAccommodationById(id: string): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
      relations: ['address', 'amenity', 'images'],
    });
    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }
    return accommodation;
  }
}
