import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accommodation } from '../entities/accommodations.entity';

@Injectable()
export class AccommodationsService {
  constructor(
    @InjectRepository(Accommodation) private accommodationRepo: Accommodation,
  ) {}

  create() {
    return 'This action adds a new Accommodation';
  }

  findAll() {
    return `This action returns all Accommodation`;
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
