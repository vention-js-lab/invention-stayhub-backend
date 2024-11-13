import { Controller, Post, Param, Body } from '@nestjs/common';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';
import { AccommodationAddressService } from '#/modules/accommodations/services/accommodation-address.service';
import { AccommodationImageService } from '#/modules/accommodations/services/accommodation-image.service';
import { AccommodationAmenityService } from '#/modules/accommodations/services/accommodation-amenity.service';
import { AccommodationAddressDto } from '#/modules/accommodations/dto/requests/create-accommodation-address.req';
import { AccommodationImageDto } from '#/modules/accommodations/dto/requests/create-accommodation-image.req';
import { AccommodationAmenityDto } from '#/modules/accommodations/dto/requests/create-accommodation-amenity.req';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { AccommodationImage } from '#/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationAmenity } from '#/modules/accommodations/entities/accommodation-amenity.entity';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';

@Controller('accommodations')
export class AccommodationController {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly accommodationAddressService: AccommodationAddressService,
    private readonly accommodationImageService: AccommodationImageService,
    private readonly accommodationAmenityService: AccommodationAmenityService,
  ) {}

  @Post()
  async createAccommodation(
    @Body() createAccommodationDto: AccommodationDto,
  ): Promise<Accommodation> {
    return this.accommodationService.create(createAccommodationDto);
  }

  // Route to create an address for an accommodation
  @Post(':accommodationId/address')
  async createAddress(
    @Param('accommodationId') accommodationId: string,
    @Body() addressDto: AccommodationAddressDto,
  ): Promise<AccommodationAddress> {
    return this.accommodationAddressService.create(accommodationId, addressDto);
  }

  // Route to add images to an accommodation
  @Post(':accommodationId/images')
  async addImages(
    @Param('accommodationId') accommodationId: string,
    @Body() imagesDto: AccommodationImageDto[],
  ): Promise<AccommodationImage[]> {
    return Promise.all(
      imagesDto.map((imageDto) =>
        this.accommodationImageService.create(accommodationId, imageDto),
      ),
    );
  }

  // Route to add amenities to an accommodation
  @Post(':accommodationId/amenity')
  async createAmenity(
    @Param('accommodationId') accommodationId: string,
    @Body() amenityDto: AccommodationAmenityDto,
  ): Promise<AccommodationAmenity> {
    return this.accommodationAmenityService.create(accommodationId, amenityDto);
  }
}
