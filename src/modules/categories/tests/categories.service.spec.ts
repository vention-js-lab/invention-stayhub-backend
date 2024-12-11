import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../categories.service';
import { Category } from '../entities/categories.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

const mockCategoryRepository = {
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listCategories', () => {
    it('should return a list of categories with total count', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      const mockTotal = 2;
      mockCategoryRepository.findAndCount.mockResolvedValue([mockCategories, mockTotal]);

      const result = await service.listCategories();

      expect(result).toEqual({ result: mockCategories, total: mockTotal });
      expect(mockCategoryRepository.findAndCount).toHaveBeenCalledWith({});
    });
    it('should throw an error if database operation fails', async () => {
      mockCategoryRepository.findAndCount.mockRejectedValue(new InternalServerErrorException());

      await expect(service.listCategories()).rejects.toThrow(InternalServerErrorException);
      expect(mockCategoryRepository.findAndCount).toHaveBeenCalledTimes(2);
    });
  });

  describe('create', () => {
    it('should create and return a new category', async () => {
      const mockCategoryDto = { name: 'New Category', icon: 'category-icon.png' };
      const mockCategory = { id: 1, name: 'New Category' };

      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(mockCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(mockCategoryDto);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(mockCategory);
    });
    it('should throw an error if save fails', async () => {
      const categoryDto = { name: 'New Category', icon: 'category-icon.png' };

      mockCategoryRepository.create.mockReturnValue(categoryDto);
      mockCategoryRepository.save.mockRejectedValue(new BadRequestException('Invalid data'));

      await expect(service.create(categoryDto)).rejects.toThrow(BadRequestException);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(categoryDto);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(categoryDto);
    });
  });
});
