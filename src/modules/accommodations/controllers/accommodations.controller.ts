import { SnakeToCamelInterceptor } from '#/shared/interceptors/snake-to-camel.interceptor';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AccommodationFiltersQueryDto } from '../dto/accomodation-filters.dto';
import { AccommodationsService } from '../services/accommodations.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';

@Controller('accommodation')
export class AccommodationsController {
  constructor(private readonly accommodationService: AccommodationsService) {}

  @Post()
  create() {
    return this.accommodationService.create();
  }

  @Get()
  @UseInterceptors(SnakeToCamelInterceptor)
  @ApiOperation({ summary: 'Get all accommodations with filters' })
  @ApiQuery({
    name: 'filters',
    type: AccommodationFiltersQueryDto,
    required: false,
    description: 'Query parameters for filtering accommodations',
  })
  @ApiResponse({
    status: 200,
    description: 'List of accommodations fetched successfully',
  })
  async getAllAccommodations(@Query() filters: AccommodationFiltersQueryDto) {
    const result =
      await this.accommodationService.getAllAccommodations(filters);

    return result;
  }

  @Get(':id')
  findOne() {
    return this.accommodationService.findOne();
  }

  @Put()
  update() {
    return this.accommodationService.update();
  }

  @Delete()
  remove() {
    return this.accommodationService.remove();
  }
}
