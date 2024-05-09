import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Products } from '../../entities/products.entity';
import { Categories } from '../../entities/categories.entity';

describe('ProductsService', () => {
  let productsService: ProductsService;

  const mockCategories = [
    { name: 'Category 1' },
    { name: 'Category 2' },
    { name: 'Category 3' },
  ];

  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      description: 'The best product in the world',
      price: 150.0,
      stock: 10,
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'The best product in the world',
      price: 100.0,
      stock: 5,
    },
  ];

  const mockNewProduct = {
    name: 'Product 3',
    description: 'The best product in the world',
    price: 120.0,
    stock: 5,
  };

  const mockCategoriesRepository = {
    find: jest.fn().mockResolvedValue(mockCategories),
  };

  const mockProductsRepository = {
    find: jest.fn().mockResolvedValue(mockProducts),
    findOneBy: jest.fn().mockResolvedValue(undefined),
    save: jest.fn().mockImplementation(async (product) => {
      mockProducts.push({ ...product, id: '3' });
      return product;
    }),

    update: jest.fn().mockImplementation(async (id, product) => {
      if (id) {
        mockProducts[id - 1] = { ...product, id };
        return product;
      }
    }),

    delete: jest.fn().mockImplementation(async ({ id }) => {
      if (id) {
        mockProducts.splice(id - 1, 1);
        return mockProducts[id];
      }
    }),

    createQueryBuilder: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      orUpdate: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: mockProductsRepository,
        },
        {
          provide: getRepositoryToken(Categories),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('Should create an instance of ProductsService', () => {
    expect(productsService).toBeDefined();
  });

  it('getProducts() must return all registered products', async () => {
    const products = await productsService.getProducts();

    expect(products).toBeDefined();
    expect(products.length).toEqual(mockProducts.length);
    expect(products).toEqual(mockProducts);
  });

  it('getProductById() must return error if no product was found', async () => {
    try {
      await productsService.getProductById('1');
    } catch (error) {
      expect(error.message).toEqual('Product not found');
    }
  });

  it('getProductById() must return product if found', async () => {
    mockProductsRepository.findOneBy = jest
      .fn()
      .mockResolvedValue(mockProducts[0]);

    const product = await productsService.getProductById('1');

    expect(product).toBeDefined();
    expect(product).toEqual(mockProducts[0]);
  });

  it('newProduct() must return the new product', async () => {
    mockProductsRepository.findOneBy = jest.fn().mockResolvedValue(undefined);

    const product = await productsService.newProduct(mockNewProduct);

    const products = await productsService.getProducts();

    expect(product).toBeDefined();
    expect(products.length).toEqual(mockProducts.length);
    expect(products[mockProducts.length - 1]).toEqual({ ...product, id: '3' });
  });

  it('updateProduct() must return error if no product was found', async () => {
    try {
      await productsService.updateProduct(undefined, mockNewProduct);
    } catch (error) {
      expect(error.message).toEqual('Product not found');
    }
  });

  it('updateProduct() must return the updated product', async () => {
    mockProductsRepository.findOneBy = jest
      .fn()
      .mockResolvedValue(mockProducts[0]);

    const product = await productsService.updateProduct(
      mockProducts[0].id,
      mockNewProduct,
    );
    const products = await productsService.getProducts();

    expect(product).toBeDefined();
    expect(products[0]).toEqual({ ...mockNewProduct, id: mockProducts[0].id });
  });

  it('deleteProduct() must return the error if no product was found', async () => {
    try {
      await productsService.deleteProduct(undefined);
    } catch (error) {
      expect(error.message).toEqual('Product not found');
    }
  });

  it('deleteProduct() must return the deleted product', async () => {
    mockProductsRepository.findOneBy = jest
      .fn()
      .mockResolvedValue(mockProducts[0]);

    const product = await productsService.deleteProduct(mockProducts[0].id);
    const products = await productsService.getProducts();

    expect(product).toBeDefined();
    expect(products.length).toEqual(mockProducts.length);
  });

  it('addProducts() returns created product if there are already categories', async () => {
    await productsService.addProducts();

    expect(
      mockProductsRepository.createQueryBuilder().insert().execute,
    ).toHaveBeenCalled();
  });

  it('addProducts() must return error if there are no categories', async () => {
    mockCategoriesRepository.find = jest.fn().mockResolvedValue([]);

    try {
      await productsService.addProducts();
    } catch (error) {
      expect(error.message).toEqual('Categories must be added first');
    }
  });
});
