import { Body, Controller, Delete, Get, Patch, Post, Req, Res } from '@nestjs/common';
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
  @Patch('update')
  updateProduct(
    @Body()
    body: {
      id: number;
      name?: string;
      price?: number;
    },
  ) {
    return this.productsService.updateProduct(body.id, {
      name: body.name,
      price: body.price,
    });
  }
   @Delete('delete')
  deleteProduct(@Body() body: { id: number }) {
    return this.productsService.deleteProduct(body.id);
  }

  
}

