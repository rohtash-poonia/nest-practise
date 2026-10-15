import { Controller, Post, Body } from '@nestjs/common';

import { OtpService } from './otp.service.js';
import { GenerateOtpDto } from './dto/generate-otp.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // POST /otp/generate
  @Post('generate')
  generateOtp(@Body() body: GenerateOtpDto) {
    return this.otpService.generateOtp(body.email);
  }

  // POST /otp/verify
  @Post('verify')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.otpService.verifyOtp(body.email, body.otp);
  }
}
