import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../../entities/categories.entity';
import { Products } from '../../entities/products.entity';
import { Repository } from 'typeorm';
import * as data from '../../data/data.json';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getProducts(page: number = 1, limit: number = 10): Promise<Products[]> {
    let products = await this.productsRepository.find({
      relations: {
        category: true,
      },
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    products = products.slice(start, end);
    return products;
  }

  async getProductById(id: string): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async newProduct(product: Partial<Products>): Promise<Products> {
    const { name } = product;

    const { id } = product.category;

    const foundProduct = await this.productsRepository.findOneBy({ name });
    if (foundProduct)
      throw new ConflictException('Product is already registered');

    const foundCategory = await this.categoriesRepository.findOneBy({ id });

    if (!foundCategory) throw new ConflictException('Category not found');

    const newProduct = await this.productsRepository.save(product);

    return newProduct;
  }

  async updateProduct(
    id: string,
    product: Partial<Products>,
  ): Promise<Products> {
    await this.productsRepository.update(id, product);

    const updatedProduct = await this.productsRepository.findOneBy({ id });

    if (!updatedProduct) throw new NotFoundException('Product not found');
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product not found');

    await this.productsRepository.delete({ id });

    return product;
  }

  async addProducts() {
    const categories = await this.categoriesRepository.find();

    if (!categories.length)
      throw new NotFoundException('Categories must be added first');

    const productsData = data.map((element) => {
      const category = categories.find(
        (category) => category.name === element.category,
      );

      const product = new Products();

      product.name = element.name;
      product.description = element.description;
      product.price = element.price;
      product.stock = element.stock;
      product.imgUrl = element.imgUrl;
      product.category = category;

      return product;
    });

    await this.productsRepository
      .createQueryBuilder()
      .insert()
      .into(Products)
      .values(productsData)
      .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
      .execute();
  }
}
