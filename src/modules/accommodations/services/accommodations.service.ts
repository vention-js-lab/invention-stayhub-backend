import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { Repository } from 'typeorm';
import { getPaginationOffset } from '#/shared/utils/pagination-offset.util';
import { sortByParams } from '../utils/sort-by-params.util';
import { AccommodationFiltersQueryDto } from '../dto/accommodation-filters.dto';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
  ) {}

  create() {
    return 'This action adds a new Accommodation';
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

  findOne() {
    return `This action returns Accommodation`;
  }

  update() {
    return `This action updates Accommodation`;
  }

  remove() {
    return `This action removes Accommodation`;
  }
}
