import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { withBaseResponse } from '#/shared/utils/with-base-response.util';
import { CategoryDto } from './dto/requests/cretae-category.req';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories are retreived successfully',
  })
  async listCategories() {
    const categories = await this.categoriesService.listCategories();
    return withBaseResponse({
      status: 200,
      message: 'Categories are retreived successfully',
      data: categories,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or failed validation.',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async createCategory(@Body() categoryDto: CategoryDto) {
    const result = await this.categoriesService.create(categoryDto);
    return withBaseResponse({
      status: 201,
      message: 'Category created successfully',
      data: result,
    });
  }
}
