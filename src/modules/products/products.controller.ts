import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProductsService } from './products.service.js';
import type { GetProductsByIdRequest } from './types/product.types.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.products;
  }

  @Get(':id')
  getProductsById(@Req() req: GetProductsByIdRequest, @Res() res: Response) {
    return this.productsService.getProductsId(req.body.id);
  }
  @Post()
  createProduct(@Body() product: { name: string; price: number }) {
    return this.productsService.createProduct(product);
  }
}
