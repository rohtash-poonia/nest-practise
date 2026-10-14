import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: { id: string };
    }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const [scheme, token, ...extraParts] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token || extraParts.length > 0) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException(
        'JWT Secret is not configured on the server',
      );
    }

    try {
      const decoded = jwt.verify(token, secret);
      if (
        typeof decoded === 'string' ||
        !decoded.sub ||
        typeof decoded.tokenVersion !== 'number'
      ) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }
      if (user.tokenVersion !== decoded.tokenVersion) {
        throw new UnauthorizedException('Authentication token has been revoked');
      }

      request.user = { id: user.id };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid or expired authentication token');
      }
      throw error;
    }
  }
}
