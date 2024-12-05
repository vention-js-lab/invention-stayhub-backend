import { type SelectQueryBuilder } from 'typeorm';
import { type AccommodationFiltersReqQueryDto } from '../dto/request/accommodation-filters.req';
import { type Accommodation } from '../entities/accommodation.entity';
import { BadRequestException } from '@nestjs/common';
import { time } from '#/shared/libs/time.lib';

export function addPriceFilters(queryBuilder: SelectQueryBuilder<Accommodation>, filters: AccommodationFiltersReqQueryDto) {
  if (filters.minPrice) {
    queryBuilder.andWhere('accommodation.price >= :minPrice', {
      minPrice: filters.minPrice,
    });
  }
  if (filters.maxPrice) {
    queryBuilder.andWhere('accommodation.price <= :maxPrice', {
      maxPrice: filters.maxPrice,
    });
  }
}

export function addAvailabilityFilters(
  queryBuilder: SelectQueryBuilder<Accommodation>,
  filters: AccommodationFiltersReqQueryDto,
) {
  if (filters.available !== undefined) {
    queryBuilder.andWhere('accommodation.available = :available', {
      available: filters.available,
    });
  }

  if (filters.availableFrom && filters.availableTo) {
    if (time(filters.availableFrom).toDate() > time(filters.availableTo).toDate()) {
      throw new BadRequestException('availableFrom date cannot be greater then availableTo date');
    }

    queryBuilder.andWhere('accommodation.availableFrom <= :availableFrom AND accommodation.availableTo >= :availableTo', {
      availableFrom: filters.availableFrom,
      availableTo: filters.availableTo,
    });
  } else {
    if (filters.availableFrom) {
      queryBuilder.andWhere('accommodation.availableFrom <= :availableFrom', {
        availableFrom: filters.availableFrom,
      });
    }

    if (filters.availableTo) {
      queryBuilder.andWhere('accommodation.availableTo >= :availableTo', {
        availableTo: filters.availableTo,
      });
    }
  }
}

export function addApartmentFilters(queryBuilder: SelectQueryBuilder<Accommodation>, filters: AccommodationFiltersReqQueryDto) {
  if (filters.rooms) {
    queryBuilder.andWhere('accommodation.numberOfRooms = :numberOfRooms', {
      numberOfRooms: filters.rooms,
    });
  }
}

export function addSearchFilters(queryBuilder: SelectQueryBuilder<Accommodation>, filters: AccommodationFiltersReqQueryDto) {
  if (filters.search) {
    queryBuilder.andWhere('(accommodation.name ILIKE :search OR accommodation.description ILIKE :search)', {
      search: `%${filters.search}%`,
    });
  }
  if (filters.street) {
    queryBuilder.andWhere('address.street ILIKE :street', {
      street: `%${filters.street}%`,
    });
  }
  if (filters.city) {
    queryBuilder.andWhere('address.city ILIKE :city', {
      city: `%${filters.city}%`,
    });
  }
  if (filters.country) {
    queryBuilder.andWhere('address.country ILIKE :country', {
      country: `%${filters.country}%`,
    });
  }
}

export function addAmenityFilters(queryBuilder: SelectQueryBuilder<Accommodation>, filters: AccommodationFiltersReqQueryDto) {
  const amenityFilters = {
    hasWifi: 'amenity.hasWifi = :hasWifi',
    hasParking: 'amenity.hasParking = :hasParking',
    hasSwimmingPool: 'amenity.hasSwimmingPool = :hasSwimmingPool',
    hasPetAllowance: 'amenity.hasPetAllowance = :hasPetAllowance',
    hasBackyard: 'amenity.hasBackyard = :hasBackyard',
    hasSmokingAllowance: 'amenity.hasSmokingAllowance = :hasSmokingAllowance',
    hasHospitalNearby: 'amenity.hasHospitalNearby = :hasHospitalNearby',
    hasLaundryService: 'amenity.hasLaundryService = :hasLaundryService',
    hasKitchen: 'amenity.hasKitchen = :hasKitchen',
    hasAirConditioning: 'amenity.hasAirConditioning = :hasAirConditioning',
    hasTv: 'amenity.hasTv = :hasTv',
    hasAirportTransfer: 'amenity.hasAirportTransfer = :hasAirportTransfer',
    isCloseToCenter: 'amenity.isCloseToCenter = :isCloseToCenter',
    isChildFriendly: 'amenity.isChildFriendly = :isChildFriendly',
    isQuietArea: 'amenity.isQuietArea = :isQuietArea',
  };

  for (const [key, condition] of Object.entries(amenityFilters)) {
    if (filters[key] !== undefined) {
      queryBuilder.andWhere(condition, { [key]: filters[key] });
    }
  }
}
