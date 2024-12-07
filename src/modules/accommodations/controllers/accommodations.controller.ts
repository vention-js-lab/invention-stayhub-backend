import { Controller, Post, Body, UseGuards, UseInterceptors, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AccommodationsService } from '#/modules/accommodations/services/accommodations.service';
import { Accommodation } from '#/modules/accommodations/entities/accommodation.entity';
import { AccommodationDto } from '#/modules/accommodations/dto/request/create-accommodation.req';
import { AccessTokenGuard } from '#/shared/guards/access-token.guard';
import { GetAccount } from '#/shared/decorators/get-account.decorator';
import { SnakeToCamelInterceptor } from '#/shared/interceptors/snake-to-camel.interceptor';
import { AccommodationFiltersReqQueryDto } from '../dto/request/accommodation-filters.req';
import { UpdateAccommodationDto } from '../dto/request/update-accommodation.req';
import { UUIDValidationPipe } from '#/shared/pipes/uuid-validation.pipe';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';

@ApiTags('accommodations')
@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create a new accommodation' })
  @ApiResponse({
    status: 201,
    description: 'Accommodation created successfully.',
    type: Accommodation,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  async create(@Body() accommodationDto: AccommodationDto, @GetAccount('accountId') ownerId: string) {
    const createdAccommodation = await this.accommodationsService.create({
      createAccommodationDto: accommodationDto,
      ownerId,
    });
    return withBaseResponse({
      status: 201,
      message: 'Accommodation created successfully',
      data: createdAccommodation,
    });
  }

  @Get()
  @UseInterceptors(SnakeToCamelInterceptor)
  @ApiOperation({ summary: 'Get all accommodations with filters' })
  @ApiQuery({
    name: 'filters',
    type: AccommodationFiltersReqQueryDto,
    required: false,
    description: 'Query parameters for filtering accommodations',
  })
  @ApiResponse({
    status: 200,
    description: 'List of accommodations fetched successfully',
  })
  async listAccommodations(@Query() filters: AccommodationFiltersReqQueryDto) {
    const accommodations = await this.accommodationsService.listAccommodations(filters);

    return withBaseResponse({
      status: 200,
      message: 'Accommodations are retrieved successfully',
      data: accommodations,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get accommodation by ID with reviews' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation fetched successfully with reviews',
    type: Accommodation,
  })
  async getAccommodationById(@Param('id') id: string) {
    const accommodation = await this.accommodationsService.getAccommodationById(id);

    return withBaseResponse({
      status: 200,
      message: 'Accommodation is retrieved successfully',
      data: accommodation,
    });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update accommodation details' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation updated successfully',
  })
  async update(
    @Param('id', new UUIDValidationPipe()) accommodationId: string,
    @GetAccount('accountId') ownerId: string,
    @Body() updateAccommodationDto: UpdateAccommodationDto,
  ) {
    const updatedAccommodation = await this.accommodationsService.update({
      accommodationId,
      ownerId,
      updateAccommodationDto,
    });
    return withBaseResponse({
      status: 200,
      message: 'Accommodation is updated successfully',
      data: updatedAccommodation,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Soft delete an accommodation by owner' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation soft deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Accommodation not found or already deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized request.' })
  async softDeleteAccommodation(@Param('id') accommodationId: string, @GetAccount('accountId') ownerId: string) {
    await this.accommodationsService.softDeleteAccommodationByOwner(accommodationId, ownerId);

    return withBaseResponse({
      status: 204,
      message: 'Accommodation is soft deleted successfully',
      data: null,
    });
  }
}
