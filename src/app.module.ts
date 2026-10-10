import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './modules/users/user.module.js';
import { ProductsService } from './modules/products/products.service.js';
import { ProductsController } from './modules/products/products.controller.js';
import { ProductsModule } from './modules/products/products.module.js';
import { PrismaService } from './modules/prisma/prisma.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ProductsModule,
    PrismaModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService, PrismaService],
})
export class AppModule {}
