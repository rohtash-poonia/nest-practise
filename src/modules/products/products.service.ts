import { Injectable } from '@nestjs/common';
import { productType } from './types/product.types.js';

@Injectable()
export class ProductsService {
  products = [
    {
      id: '1',
      name: 'iPhone 15',
      price: 69999,
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      price: 74999,
    },
    {
      id: '3',
      name: 'OnePlus 12',
      price: 64999,
    },
    {
      id: '4',
      name: 'Google Pixel 8',
      price: 59999,
    },
    {
      id: '5',
      name: 'Sony WH-1000XM5',
      price: 29999,
    },
  ];

  getProductsId(id: string) {
    return this.products.find((product) => product.id === id);
  }

  createProduct(data: { name: string; price: number }) {
    const newProduct = {
      id: String(this.products.length + 1),
      name: data.name,
      price: data.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(
    id: string,
    data: {
      name?: string;
      price?: number;
    },
  ) {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      return {
        message: 'Product not found',
      };
    }

    if (data.name !== undefined) {
      product.name = data.name;
    }

    if (data.price !== undefined) {
      product.price = data.price;
    }

    return product;
  }

  deleteProduct(id: string) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return { message: 'Product not found' };
    }

    return this.products.splice(index, 1)[0];
  }
}
