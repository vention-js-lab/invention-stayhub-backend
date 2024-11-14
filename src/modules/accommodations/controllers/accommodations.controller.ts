import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AccommodationService } from '#/modules/accommodations/services/accommodations.service';
import { Accommodation } from '#/modules/accommodations/entities/accommodations.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/requests/create-accommodation.req';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/modules/auth/decorators/get-account.decorator';
import { SnakeToCamelInterceptor } from '#/shared/interceptors/snake-to-camel.interceptor';
import { AccommodationFiltersQueryDto } from '../dto/requests/accommodation-filters.dto';

@ApiTags('Accommodations')
@ApiBearerAuth()
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create a new accommodation' })
  @ApiResponse({
    status: 201,
    description: 'Accommodation created successfully.',
    type: Accommodation,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  async create(
    @Body() accommodationDto: AccommodationDto,
    @GetAccount('accountId') ownerId: string,
  ): Promise<Accommodation> {
    return this.accommodationService.create({
      createAccommodationDto: accommodationDto,
      ownerId,
    });
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
  async listAccommodations(@Query() filters: AccommodationFiltersQueryDto) {
    const result = await this.accommodationService.listAccommodations(filters);

    return result;
  }
}
