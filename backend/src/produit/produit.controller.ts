// src/products/products.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
  Body,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/produit.dto';
import { ProductsService } from './produit.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiSecurity, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
@ApiSecurity('JWT-auth')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post('/create-prod')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
    FilesInterceptor('images', 3, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  createProduct(
    @UploadedFile() image: Express.Multer.File,
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @Req() req: Request,
  ) {
    console.log('Request body:', req.body);
    console.log('CreateProductDto:', createProductDto);
    console.log('Image:', image);
    // return this.productsService.createProduct(createProductDto, image, images);
  }
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('video'), FilesInterceptor('images', 10))
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @UploadedFile() video?: Express.Multer.File,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.productsService.updateProduct(
      id,
      updateProductDto,
      video,
      images,
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
