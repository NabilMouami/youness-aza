// src/products/dto/create-product.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  category: string;
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  price_promo: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];
  @ApiProperty()
  @IsString()
  meta_image: string;

  @ApiProperty()
  @IsString()
  meta_images: string;

  @ApiProperty()
  @IsString()
  nemuro_shoes: string;

  @ApiProperty()
  @IsString()
  description: string;
}
