import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
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

    return createdAccommodation;
  }
}
