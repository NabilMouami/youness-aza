// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './produit.service';
import { ProductsController } from './produit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from './entities/produit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produit])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
