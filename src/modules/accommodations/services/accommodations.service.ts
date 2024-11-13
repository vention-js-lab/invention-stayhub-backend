import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { AccommodationImage } from '#/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';

@Injectable()
export class AccommodationService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,

    @InjectRepository(AccommodationAddress)
    private accommodationAddressRepository: Repository<AccommodationAddress>,

    @InjectRepository(AccommodationImage)
    private accommodationImageRepository: Repository<AccommodationImage>,

    @InjectRepository(AccommodationAmenity)
    private accommodationAmenityRepository: Repository<AccommodationAmenity>,
  ) {}

  async create(
    createAccommodationDto: AccommodationDto,
    owner_id: string,
  ): Promise<Accommodation> {
    const accommodation = this.accommodationRepository.create({
      ...createAccommodationDto,
      ownerId: owner_id,
    });
    const savedAccommodation =
      await this.accommodationRepository.save(accommodation);

    const amenity = this.accommodationAmenityRepository.create({
      ...createAccommodationDto.amenity,
      accommodation: savedAccommodation,
    });
    await this.accommodationAmenityRepository.save(amenity);

    const address = this.accommodationAddressRepository.create({
      ...createAccommodationDto.address,
      accommodation: savedAccommodation,
    });
    await this.accommodationAddressRepository.save(address);

    if (
      createAccommodationDto.images &&
      createAccommodationDto.images.length > 0
    ) {
      const images = createAccommodationDto.images.map((imageDto) =>
        this.accommodationImageRepository.create({
          ...imageDto,
          accommodation: savedAccommodation,
        }),
      );
      await this.accommodationImageRepository.save(images);
    }

    return savedAccommodation;
  }
}
