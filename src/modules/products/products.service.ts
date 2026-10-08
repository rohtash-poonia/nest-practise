import { Injectable } from '@nestjs/common';

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
}
