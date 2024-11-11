import { AccommodationsService } from '../services/accommodations.service';
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('accommodation')
export class AccommodationsController {
  constructor(private readonly AccommodationService: AccommodationsService) {}

  @Post()
  create() {
    return this.AccommodationService.create();
  }

  @Get()
  findAll() {
    return this.AccommodationService.findAll();
  }

  @Get()
  findOne() {
    return this.AccommodationService.findOne();
  }

  @Put()
  update() {
    return this.AccommodationService.update();
  }

  @Delete()
  remove() {
    return this.AccommodationService.remove();
  }
}
