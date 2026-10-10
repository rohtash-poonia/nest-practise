import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(readonly prismaService: PrismaService) {}

  async createUser(transactionId: string, utr: string) {
    if (!transactionId) {
      throw new BadRequestException('transactionId is required');
    }
    if (!utr) {
      throw new BadRequestException('utr is required');
    }

    const newRecord = await this.prismaService.gunjan.create({
      data: { transactionId, utr },
    });

    return newRecord;
  }
}
