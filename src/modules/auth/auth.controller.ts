import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../guards/auth.guard.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  register(
    @Body()
    body: {
      username: string;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    },
  ) {
    return this.authService.register(body);
  }
  @Post('login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.login(body);
  }
}
