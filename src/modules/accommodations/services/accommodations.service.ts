import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { Repository } from 'typeorm';
import { AccommodationAddressService } from './accommodation-address.service';
import { AccommodationAmenityService } from './accommodation-amenity.service';
import { AccommodationImageService } from './accommodation-image.service';
import { AccommodationFiltersReqQueryDto } from '../dto/requests/accommodation-filters.req';
import {
  getPaginationMetadata,
  getPaginationOffset,
} from '#/shared/utils/pagination.util';
import { sortByParams } from '../utils/sort-by-params.util';

import {
  addPriceFilters,
  addAvailabilityFilters,
  addAmenityFilters,
  addSearchFilters,
  addApartmentFilters,
} from '../helpers/accommodation-filters.util';
import {
  CreateAccommodationParams,
  UpdateAccommodationParams,
} from '../types/accommodations-service.type';
import { paginationParams } from '../utils/pagination-params.util';

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

  async listAccommodations(filters: AccommodationFiltersReqQueryDto) {
    const queryBuilder = this.accommodationRepository
      .createQueryBuilder('accommodation')
      .leftJoinAndSelect('accommodation.address', 'address')
      .leftJoinAndSelect('accommodation.amenity', 'amenity')
      .leftJoinAndSelect('accommodation.images', 'image')
      .where('accommodation.deletedAt is NULL');

    addPriceFilters(queryBuilder, filters);
    addAvailabilityFilters(queryBuilder, filters);
    addSearchFilters(queryBuilder, filters);
    addApartmentFilters(queryBuilder, filters);
    addAmenityFilters(queryBuilder, filters);
    const { page, limit } = paginationParams(filters);

    const { skip, take } = getPaginationOffset(page, limit);
    queryBuilder.skip(skip).take(take);

    const orderBy = sortByParams(filters);
    for (const [key, value] of Object.entries(orderBy)) {
      queryBuilder.addOrderBy(`accommodation.${key}`, value);
    }

    const [result, total] = await queryBuilder.getManyAndCount();
    const metadata = getPaginationMetadata({ page, limit, total });
    return {
      result,
      metadata,
    };
  }

  async getAccommodationById(id: string) {
    const accommodation = await this.accommodationRepository
      .createQueryBuilder('accommodation')
      .leftJoinAndSelect('accommodation.address', 'address')
      .leftJoinAndSelect('accommodation.amenity', 'amenity')
      .leftJoinAndSelect('accommodation.images', 'images')
      .leftJoinAndSelect('accommodation.reviews', 'reviews')
      .leftJoinAndSelect('reviews.account', 'account')
      .leftJoinAndSelect('account.profile', 'profile')
      .where('accommodation.id = :id', { id })
      .andWhere('accommodation.deletedAt IS NULL')
      .getOne();

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }

    const result = {
      ...accommodation,
      reviews: accommodation.reviews.map((review) => ({
        id: review.id,
        content: review.content,
        rating: review.rating,
        createdAt: review.createdAt,
        user: {
          id: review.account.id,
          firstName: review.account.profile.firstName,
          lastName: review.account.profile.lastName,
          country: review.account.profile.country,
          photo: review.account.profile.image,
          profileCreatedAt: review.account.profile.createdAt,
        },
      })),
    };

    return result;
  }

  async update({
    accommodationId,
    ownerId,
    updateAccommodationDto,
  }: UpdateAccommodationParams) {
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
