import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';
import { ListAccommodationsParamsDto } from '../dto/requests/list-accommodations-params.dto';
import { Repository } from 'typeorm';
import { SortOrder } from '#/shared/constants/sort-order.constant';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation)
    private accommodationRepository: Repository<Accommodation>,
  ) {}

  create() {
    return 'This action adds a new Accommodation';
  }

  async listAccommodations(searchParams: ListAccommodationsParamsDto) {
    const page = searchParams.page ?? 1;
    const limit = searchParams.limit ?? 20;

    const sortByPrice = searchParams.sortByPrice ?? undefined;
    const sortByNumberOfRooms = searchParams.sortByNumberOfRooms ?? undefined;
    const sortByNumberOfPeople = searchParams.sortByNumberOfPeople ?? undefined;
    const sortByCreatedAt = searchParams.sortByCreatedAt ?? SortOrder.Desc;

    const sortBy = {
      price: sortByPrice,
      numberOfRooms: sortByNumberOfRooms,
      allowedNumberOfPeople: sortByNumberOfPeople,
      createdAt: sortByCreatedAt,
    };

    const accommodations = await this.accommodationRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: sortBy,
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
