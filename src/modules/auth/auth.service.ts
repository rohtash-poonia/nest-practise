import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const PASSWORD_HASH_BYTES = 64;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, PASSWORD_HASH_BYTES, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`scrypt$${salt}$${key.toString('hex')}`);
    });
  });
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(emailInput: unknown, passwordInput: unknown) {
    if (typeof emailInput !== 'string' || typeof passwordInput !== 'string') {
      throw new BadRequestException('email and password are required');
    }

    const email = emailInput.trim().toLowerCase();
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw new BadRequestException('A valid email is required');
    }
    if (
      passwordInput.length < MIN_PASSWORD_LENGTH ||
      passwordInput.length > MAX_PASSWORD_LENGTH
    ) {
      throw new BadRequestException(
        `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`,
      );
    }

    const passwordHash = await hashPassword(passwordInput);
    try {
      return await this.prismaService.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, createdAt: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('An account with this email already exists');
      }
      throw error;
    }
  }
}
