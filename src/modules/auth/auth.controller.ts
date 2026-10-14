import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
