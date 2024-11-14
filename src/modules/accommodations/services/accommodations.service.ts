import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { Repository } from 'typeorm';
import { getPaginationOffset } from '#/shared/utils/pagination-offset.util';
import { sortByParams } from '../utils/sort-by-params.util';
import { AccommodationFiltersQueryDto } from '../dto/accommodation-filters.dto';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';
import { AccommodationAddressService } from './accommodation-address.service';
import { AccommodationAmenityService } from './accommodation-amenity.service';
import { AccommodationImageService } from './accommodation-image.service';

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
    const { skip, take } = getPaginationOffset(filters.page, filters.limit);
    const accommodations = await this.accommodationRepository.find({
      skip,
      take,
      order: sortByParams(filters),
    });

    return accommodations;
  }
}
