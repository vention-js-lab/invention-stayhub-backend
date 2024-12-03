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

  async create(accommodationId: string, createAccommodationImagesDto: AccommodationImageDto[]): Promise<AccommodationImage[]> {
    const newAccommodationImages = createAccommodationImagesDto.map((imageDto) =>
      this.accommodationImageRepository.create({
        ...imageDto,
        accommodationId,
      }),
    );
    const createdAccommodationImages = await this.accommodationImageRepository.save(newAccommodationImages);

    return createdAccommodationImages;
  }
}
