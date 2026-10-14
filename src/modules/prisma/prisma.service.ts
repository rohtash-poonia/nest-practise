import { Injectable } from '@nestjs/common';

// Database ke saath kaam karne wala client
// Ye Prisma ka generated client hai. Iski help se hum database mein data create, read, update aur delete karte hain.
import { PrismaClient } from '../../generated/prisma/client.js';

// Ye Prisma Client ko PostgreSQL driver ke saath connect karne ke liye adapter provide karta hai
import { PrismaPg } from '@prisma/adapter-pg';

// Environment variables read karne wala helper Ye NestJS ke @nestjs/config package se aata hai.
import { ConfigService } from '@nestjs/config';

// @Injectable() NestJS ka ek decorator hai, jo NestJS ko batata hai ki is class ko Dependency Injection (DI) ke through manage aur doosri classes mein inject kiya ja sakta hai.
// Dependency Injection means ki class se object example const prisma = new PrismaService() ki jarurat nahi
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    
    const adapter: PrismaPg = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL'),
    });

    //super use karte hai yaki parent class prismaClient ko initialize kar sake with the provided adapter prismaClient ke controctor ko call kar sake or usmai adapter dala hai taki 
    super({ adapter });
  }
}
