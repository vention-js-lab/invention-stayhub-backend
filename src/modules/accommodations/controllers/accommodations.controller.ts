import { ListAccommodationsParamsDto } from './../dto/requests/list-accommodations-params.dto';
import { AccommodationsService } from '../services/accommodations.service';
import { Controller, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async listAccommodations(@Query() searchParams: ListAccommodationsParamsDto) {
    const accommodations =
      await this.AccommodationService.listAccommodations(searchParams);
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
