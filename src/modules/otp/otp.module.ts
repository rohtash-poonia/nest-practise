import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller.js';
import { OtpService } from './otp.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
