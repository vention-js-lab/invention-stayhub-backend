import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
  Param,
  Patch,
  Delete,
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
import { UpdateAccommodationDto } from './../dto/requests/update-accommodation.req';
import { UUIDValidationPipe } from '#/shared/pipes/uuid-validation.pipe';

@ApiTags('Accommodations')
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

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

    return {
      data: result[0],
      total: result[1],
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get accommodation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Accommodation fetched successfully',
    type: Accommodation,
  })
  async getAccommodationById(@Param('id') id: string) {
    const accommodation =
      await this.accommodationService.getAccommodationById(id);

    return accommodation;
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
    return this.accommodationService.update({
      accommodationId,
      ownerId,
      updateAccommodationDto,
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
  async softDeleteAccommodation(
    @Param('id') accommodationId: string,
    @GetAccount('accountId') ownerId: string,
  ): Promise<{ message: string }> {
    await this.accommodationService.softDeleteAccommodationByOwner(
      accommodationId,
      ownerId,
    );

    return {
      message: `Accommodation with ID ${accommodationId} has been successfully deleted.`,
    };
  }
}
