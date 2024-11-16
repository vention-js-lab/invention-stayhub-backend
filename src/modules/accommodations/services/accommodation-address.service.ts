import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationAddress } from '#/modules/accommodations/entities/accommodation-address.entity';
import { AccommodationAddressDto } from '#/modules/accommodations/dto/requests/create-accommodation-address.req';
import { UpdateAccommodationAddressDto } from '../dto/requests/update-accommodation-address.req';

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
    const newAccommodationAddress = this.accommodationAddressRepository.create({
      accommodationId,
      ...createAccommodationAddressDto,
    });

    const createdAccommodationAddress =
      await this.accommodationAddressRepository.save(newAccommodationAddress);

    return createdAccommodationAddress;
  }

  async update(
    accommodationAddressId: string,
    updateAccommodationAddressDto: UpdateAccommodationAddressDto,
  ) {
    await this.accommodationAddressRepository.update(
      accommodationAddressId,
      updateAccommodationAddressDto,
    );

    return await this.accommodationAddressRepository.findOne({
      where: { id: accommodationAddressId },
    });
  }
}
