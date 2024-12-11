import { CategoryDto } from './dto/requests/cretae-category.req';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async listCategories() {
    const [result, total] = await this.categoryRepository.findAndCount({});
    return {
      result,
      total,
    };
  }

  async create(categoryDto: CategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(category);
  }
}
