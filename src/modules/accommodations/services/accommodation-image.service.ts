import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationImage } from '#/modules/accommodations/entities/accommodation-image.entity';
import { AccommodationImageDto } from '../dto/requests/create-accommodation-image.req';

@Injectable()
export class AccommodationImageService {
  constructor(
    @InjectRepository(AccommodationImage)
    private accommodationImageRepository: Repository<AccommodationImage>,
  ) {}

  async create(
    accommodationId: string,
    createAccommodationImageDto: AccommodationImageDto,
  ): Promise<AccommodationImage> {
    const accommodationImage = this.accommodationImageRepository.create({
      accommodationId,
      ...createAccommodationImageDto,
    });

    return this.accommodationImageRepository.save(accommodationImage);
  }
}
