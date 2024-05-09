import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../../entities/categories.entity';
import { Repository } from 'typeorm';
import * as data from '../../data/data.json';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(page: number = 1, limit: number = 10) {
    const categories = await this.categoriesRepository.find();

    const start = (page - 1) * limit;
    const end = start + limit;

    return categories.slice(start, end);
  }

  async addCategories() {
    if (!data) throw new NotFoundException('No category information was found');

    const categoriesData = data.map((element) => {
      return { name: element.category };
    });

    await this.categoriesRepository
      .createQueryBuilder()
      .insert()
      .into(Categories)
      .values(categoriesData)
      .orIgnore()
      .execute();
  }

  async newCategory(name: string) {
    const foundCategory = await this.categoriesRepository.findOneBy({ name });

    if (foundCategory)
      throw new ConflictException('Category already registered');

    const category = await this.categoriesRepository.save({ name });

    return category;
  }
}
