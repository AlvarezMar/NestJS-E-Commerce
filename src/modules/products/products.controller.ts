import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/entities/products.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/config/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Get()
  getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Products[]> {
    return this.ProductsService.getProducts(page, limit);
  }

  @Get('seeder')
  addProducts() {
    return this.ProductsService.addProducts();
  }

  @Get(':id')
  getProductById(@Param('id', ParseUUIDPipe) id: string): Promise<Products> {
    return this.ProductsService.getProductById(id);
  }
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  newProduct(@Body() product: Partial<Products>): Promise<Products> {
    return this.ProductsService.newProduct(product);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: Partial<Products>,
  ): Promise<Products> {
    return this.ProductsService.updateProduct(id, product);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<Products> {
    return this.ProductsService.deleteProduct(id);
  }
}
