import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { AccommodationAddressDto } from '#/modules/accommodations/dto/requests/create-accommodation-address.req';

@Injectable()
export class AccommodationAddressService {
  constructor(
    @InjectRepository(AccommodationAddress)
    private accommodationAddressRepository: Repository<AccommodationAddress>,
  ) {}

  async create(
    accommodationId: string,
    createAccommodationAddressDto: AccommodationAddressDto,
  ): Promise<AccommodationAddress> {
    const accommodationAddress = this.accommodationAddressRepository.create({
      accommodationId,
      ...createAccommodationAddressDto,
    });

    return this.accommodationAddressRepository.save(accommodationAddress);
  }
}
