import { randomUUID } from 'node:crypto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodation.entity';
import { In, Repository } from 'typeorm';
import { AccommodationAddressService } from './accommodation-address.service';
import { AccommodationAmenityService } from './accommodation-amenity.service';
import { AccommodationImageService } from './accommodation-image.service';
import { AccommodationFiltersReqQueryDto } from '../dto/request/accommodation-filters.req';
import { getPaginationMetadata, getPaginationOffset } from '#/shared/utils/pagination.util';
import { sortByParams } from '../utils/sort-by-params.util';
import {
  addPriceFilters,
  addAvailabilityFilters,
  addAmenityFilters,
  addSearchFilters,
  addApartmentFilters,
} from '../utils/accommodation-filters.util';
import { CreateAccommodationParams, UpdateAccommodationParams } from '../types/accommodations-service.type';
import { paginationParams } from '../utils/pagination-params.util';
import { time } from '#/shared/libs/time.lib';
import { TimeFormat } from '#/shared/constants/time.constant';
import { addIsSavedToWishlistProperty } from '../utils/is-saved-to-wishlist.util';
import { Category } from '#/modules/categories/entities/categories.entity';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private accommodationAddressService: AccommodationAddressService,
    private accommodationAmenityService: AccommodationAmenityService,
    private accommodationImageService: AccommodationImageService,
  ) {}

  async create({ createAccommodationDto, ownerId }: CreateAccommodationParams): Promise<Accommodation> {
    const { categories, ...accommodationData } = createAccommodationDto;
    const accommodation = this.accommodationRepository.create({
      ...accommodationData,
      ownerId,
    });
    const createdAccommodation = await this.accommodationRepository.save(accommodation);

    await this.accommodationAddressService.create(createdAccommodation.id, createAccommodationDto.address);

    await this.accommodationAmenityService.create(createdAccommodation.id, createAccommodationDto.amenity);

    const images = await this.accommodationImageService.create(createdAccommodation.id, createAccommodationDto.images);

    if (categories.length > 0) {
      const selectedCategories = await this.categoryRepository.findBy({
        id: In(categories),
      });
      createdAccommodation.categories = selectedCategories;
      createdAccommodation.images = images;

      await this.accommodationRepository.save(createdAccommodation);
    }

    return this.accommodationRepository.findOneOrFail({
      where: { id: createdAccommodation.id },
      relations: ['address', 'amenity', 'images'],
    });
  }

  async listAccommodations(
    filters: AccommodationFiltersReqQueryDto,
    accountId: string | undefined,
    showOwnAccommodationsOnly: boolean = false,
  ) {
    const queryBuilder = this.accommodationRepository
      .createQueryBuilder('accommodation')
      .leftJoinAndSelect('accommodation.address', 'address')
      .leftJoinAndSelect('accommodation.amenity', 'amenity')
      .leftJoinAndSelect('accommodation.images', 'image')
      .leftJoinAndSelect('accommodation.reviews', 'reviews')
      .where('accommodation.deletedAt is NULL');

    if (filters.category) {
      queryBuilder
        .leftJoinAndSelect('accommodation.categories', 'category')
        .andWhere('category.name = :category', { category: filters.category });
    }

    if (accountId) {
      queryBuilder.leftJoinAndSelect('accommodation.wishlist', 'wishlist', 'wishlist.accountId = :accountId', {
        accountId,
      });
    }

    if (showOwnAccommodationsOnly && accountId) {
      queryBuilder.andWhere('accommodation.ownerId = :accountId', { accountId });
    }

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

    const [rawResult, total] = await queryBuilder.getManyAndCount();

    const result = addIsSavedToWishlistProperty(rawResult, accountId);

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
      .leftJoinAndSelect('accommodation.bookings', 'bookings')
      .leftJoinAndSelect('reviews.account', 'reviewAccount')
      .leftJoinAndSelect('reviewAccount.profile', 'reviewProfile')
      .leftJoinAndSelect('accommodation.owner', 'ownerAccount')
      .leftJoinAndSelect('ownerAccount.profile', 'ownerProfile')
      .leftJoinAndSelect('accommodation.categories', 'categories')
      .where('accommodation.id = :id', { id })
      .andWhere('accommodation.deletedAt IS NULL')
      .getOne();

    if (!accommodation) {
      throw new NotFoundException(`Accommodation with ID ${id} not found`);
    }

    const result = {
      ...accommodation,
      bookings: accommodation.bookings.map((booking) => ({
        startDate: time(booking.startDate).format(TimeFormat.Calendar),
        endDate: time(booking.endDate).format(TimeFormat.Calendar),
        status: booking.status,
      })),
      owner: accommodation.owner
        ? {
            id: accommodation.owner.id,
            firstName: accommodation.owner.profile.firstName,
            lastName: accommodation.owner.profile.lastName,
            description: accommodation.owner.profile.description,
            avatar: accommodation.owner.profile.image,
            createdAt: time(accommodation.owner.profile.createdAt).format(TimeFormat.CalendarWithTime),
          }
        : {
            id: randomUUID(),
            firstName: 'John',
            lastName: 'Doe',
            description: 'Fake user',
            avatar: null,
            createdAt: time().format(TimeFormat.CalendarWithTime),
          },
      reviews: accommodation.reviews.map((review) => ({
        id: review.id,
        content: review.content,
        rating: review.rating,
        createdAt: time(review.createdAt).format(TimeFormat.CalendarWithTime),
        updatedAt: time(review.updatedAt).format(TimeFormat.CalendarWithTime),
        user: {
          id: review.account.id,
          firstName: review.account.profile.firstName,
          lastName: review.account.profile.lastName,
          country: review.account.profile.country,
          photo: review.account.profile.image,
          createdAt: time(review.account.profile.createdAt).format(TimeFormat.CalendarWithTime),
        },
      })),
      categories: accommodation.categories,
    };

    return result;
  }

  async update({ accommodationId, ownerId, updateAccommodationDto }: UpdateAccommodationParams) {
    const accommodation = await this.getAccommodationById(accommodationId);

    if (accommodation.ownerId !== ownerId) {
      throw new ForbiddenException('You are not the owner of this accommodation');
    }

    const { address, amenity, images, ...accommodationDetails } = updateAccommodationDto;

    const filteredDetaills = Object.entries(updateAccommodationDto).filter(([, value]) => value !== undefined);
    const definedDetails = Object.fromEntries(filteredDetaills);

    if (Object.keys(definedDetails).length === 0) {
      throw new BadRequestException('Please provide at least one field to update.');
    }

    await this.accommodationRepository.update(accommodationId, accommodationDetails);

    if (address) {
      await this.accommodationAddressService.update(accommodation.address.id, address);
    }

    if (amenity) {
      await this.accommodationAmenityService.update(accommodation.amenity.id, amenity);
    }

    if (images) {
      await this.accommodationImageService.update(accommodationId, images);
    }
    return await this.getAccommodationById(accommodationId);
  }

  async softDeleteAccommodationByOwner(accommodationId: string, ownerId: string): Promise<void> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id: accommodationId, owner: { id: ownerId } },
    });

    if (!accommodation) {
      throw new NotFoundException('Accommodation not found or already deleted.');
    }

    await this.accommodationRepository.softRemove(accommodation);
  }
}
