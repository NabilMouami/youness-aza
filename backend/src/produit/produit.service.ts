// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/produit.dto';
import { Produit } from './entities/produit.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Produit) private prodRepository: Repository<Produit>,
  ) {}
  private products = [];

  createProduct(
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
    images: Express.Multer.File[],
  ) {
    const newProduct = {
      id: this.products.length + 1,
      ...createProductDto,
      image: image?.filename,
      images: images?.map((file) => file.filename),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll() {
    return this.prodRepository.find({});
  }

  findOne(id: number) {
    return this.products.find((product) => product.id === id);
  }

  updateProduct(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
    video?: Express.Multer.File,
    images?: Express.Multer.File[],
  ) {
    const product = this.findOne(id);
    if (!product) {
      return null;
    }

    Object.assign(product, updateProductDto);

    if (video) {
      product.video = video.filename;
    }

    if (images) {
      product.images = images.map((file) => file.filename);
    }

    return product;
  }

  deleteProduct(id: number) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }

    return this.products.splice(index, 1);
  }
}
