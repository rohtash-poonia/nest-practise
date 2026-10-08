import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.products;
  }

  @Get(':id')
  getProductsById(@Param('id') id: string) {
    return this.productsService.getProductsId(id);
  }
  @Post()
  createProduct(@Body() product: { name: string; price: number }) {
    return this.productsService.createProduct(product);
  }
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      price?: number;
    },
  ) {
    return this.productsService.updateProduct(id, {
      name: body.name,
      price: body.price,
    });
  }
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  
}

