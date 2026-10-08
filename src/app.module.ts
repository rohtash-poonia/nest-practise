import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './modules/users/user.module.js';
import { ProductsService } from './modules/products/products.service.js';
import { ProductsController } from './modules/products/products.controller.js';
import { ProductsModule } from './modules/products/products.module.js';

@Module({
  imports: [UserModule, ProductsModule],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
