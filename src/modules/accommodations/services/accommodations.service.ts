import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { UpdateAccommodationDto } from '../dto/requests/update-accommodation.req';

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

interface UpdateAccommodationParams {
  accommodationId: string;
  ownerId: string;
  updateAccommodationDto: UpdateAccommodationDto;
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

  async update({
    accommodationId,
    ownerId,
    updateAccommodationDto,
  }: UpdateAccommodationParams): Promise<Accommodation> {
    const accommodation = await this.getAccommodationById(accommodationId);

    if (accommodation.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You are not the owner of this accommodation',
      );
    }

    const { address, amenity, ...accommodationDetails } =
      updateAccommodationDto;

    const filteredDetaills = Object.entries(updateAccommodationDto).filter(
      ([, value]) => value !== undefined,
    );
    const definedDetails = Object.fromEntries(filteredDetaills);

    if (Object.keys(definedDetails).length === 0) {
      throw new BadRequestException(
        'Please provide at least one field to update.',
      );
    }

    await this.accommodationRepository.update(
      accommodationId,
      accommodationDetails,
    );

    if (address) {
      await this.accommodationAddressService.update(
        accommodation.address.id,
        updateAccommodationDto.address,
      );
    }

    if (amenity) {
      await this.accommodationAmenityService.update(
        accommodation.amenity.id,
        updateAccommodationDto.amenity,
      );
    }
    return await this.getAccommodationById(accommodationId);
  }
}
