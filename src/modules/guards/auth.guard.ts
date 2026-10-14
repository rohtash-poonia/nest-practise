import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
// import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    // @InjectModel(User.name) private readonly userModel: Model,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedException(
        'JWT Secret is not configured on the server',
      );
    }

    try {
      const decoded = jwt.verify(token, secret) as any;
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token structure');
      } // Look up user in the shared database using decoded.sub (user ID)

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (!user) {
        throw new UnauthorizedException('User not found in database');
      } // Attach user to request object

      request.user = user;
      return true;
    } catch (error: any) {
      console.error(
        '[JWT-GUARD-DEBUG] Token validation failed:',
        error.message || error,
      );
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        `Invalid or expired authentication token: ${error.message || String(error)}`,
      );
    }
  }
}
