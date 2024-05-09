import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(Products)
    private readonly ProductsRepository: Repository<Products>,
  ) {}

  async uploadStream(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImage(file: Express.Multer.File, productId: string) {
    const product = await this.ProductsRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found');

    const uploadedImage = await this.uploadStream(file);
    await this.ProductsRepository.update(product.id, {
      imgUrl: uploadedImage.secure_url,
    });

    const updatedProduct = await this.ProductsRepository.findOneBy({
      id: productId,
    });
    return updatedProduct;
  }
}
