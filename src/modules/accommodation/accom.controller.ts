import { AccommodationService } from './accom.service';
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('accommodation')
export class AccommodationController {
  constructor(private readonly AccommodationService: AccommodationService) {}

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
