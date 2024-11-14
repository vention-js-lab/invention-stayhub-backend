import { AccommodationsService } from '../services/accommodations.service';
import { Controller, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccommodationFiltersQueryDto } from '../dto/accommodation-filters.dto';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly AccommodationService: AccommodationsService) {}

  @Post()
  create() {
    return this.AccommodationService.create();
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of accommodations that match filtering and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Get filtered and sorted accommodations',
  })
  @ApiResponse({
    status: 400,
    description: 'Inccorrect URL parameters',
  })
  async listAccommodations(@Query() filters: AccommodationFiltersQueryDto) {
    const accommodations =
      await this.AccommodationService.listAccommodations(filters);
    return {
      data: accommodations,
    };
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
