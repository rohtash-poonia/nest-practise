import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
  async login(dto: { email: string; password: string }) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        email: true,
        passwordHash: true,
        tokenVersion: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = await this.jwtService.signAsync({
      sub: user.id,
      tokenVersion: user.tokenVersion,
    });
    // Save JWT in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });

    return { message: 'Logout successful' };
  }
}
