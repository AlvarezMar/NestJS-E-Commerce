import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';
import { Categories } from '../../entities/categories.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoriesService.getCategories(page, limit);
  }

  @Get('seeder')
  addCategories() {
    return this.categoriesService.addCategories();
  }

  @Post()
  newCategory(@Body() category: Partial<Categories>) {
    const { name } = category;

    return this.categoriesService.newCategory(name);
  }
}
