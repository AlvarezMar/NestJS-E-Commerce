import { Test } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Categories } from '../../entities/categories.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  const mockCategoriesData = [
    { name: 'mouse' },
    { name: 'mousepad' },
    { name: 'keyboard' },
  ];

  const mockCategoriesRepository = {
    find: jest.fn().mockResolvedValue(mockCategoriesData),
    createQueryBuilder: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orIgnore: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    }),
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Categories),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('Should create an instance of categoriesService', () => {
    expect(categoriesService).toBeDefined();
  });

  it('getCategories() returns all categories', async () => {
    const categories = await categoriesService.getCategories();

    expect(categories.length).toEqual(mockCategoriesData.length);
    expect(categories).toEqual(mockCategoriesData);
  });

  it('addCategories() adds all categories ', async () => {
    await categoriesService.addCategories();

    expect(
      mockCategoriesRepository.createQueryBuilder().insert().execute,
    ).toHaveBeenCalled();
  });
});
