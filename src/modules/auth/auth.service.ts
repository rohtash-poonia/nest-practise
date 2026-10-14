import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) {
    const { username, firstname, lastname, email, password } = dto;

    if (!username || !firstname || !lastname || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        firstname,
        lastname,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }
}
