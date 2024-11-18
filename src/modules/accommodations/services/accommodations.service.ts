import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { Repository } from 'typeorm';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';
import { AccommodationAddressService } from './accommodation-address.service';
import { AccommodationAmenityService } from './accommodation-amenity.service';
import { AccommodationImageService } from './accommodation-image.service';
import { AccommodationFiltersQueryDto } from '../dto/requests/accommodation-filters.dto';
import { getPaginationOffset } from '#/shared/utils/pagination-offset.util';
import { sortByParams } from '../utils/sort-by-params.util';

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

    const { skip, take } = getPaginationOffset(filters.page, filters.limit);
    queryBuilder.skip(skip).take(take);

    const orderBy = sortByParams(filters);
    for (const [key, value] of Object.entries(orderBy)) {
      queryBuilder.addOrderBy(`accommodation.${key}`, value);
    }

    const accommodations = await queryBuilder.getMany();
    return accommodations;
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

  // async softDeleteAccommodationByOwner(
  //   accommodationId: string,
  //   ownerId: string,
  // ): Promise<void> {
  //   const accommodation = await this.accommodationRepository.findOne({
  //     where: { id: accommodationId, owner: { id: ownerId }, deletedAt: null },
  //   });

  //   if (!accommodation) {
  //     throw new NotFoundException(
  //       'Accommodation not found or already deleted.',
  //     );
  //   }

  //   accommodation.deletedAt = new Date();
  //   await this.accommodationRepository.save(accommodation);
  // }

  async softDeleteAccommodationByOwner(
    accommodationId: string,
    ownerId: string,
  ): Promise<void> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId, owner: { id: ownerId }, deletedAt: null },
    });

    if (!accommodation) {
      throw new NotFoundException(
        'Accommodation not found or already deleted.',
      );
    }

    await this.accommodationRepository.softRemove(accommodation);
  }
}
