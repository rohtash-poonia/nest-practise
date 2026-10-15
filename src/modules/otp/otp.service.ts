import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  // Generate OTP
  async generateOtp(email: string) {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await (this.prisma as any).otp.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    return {
      message: 'OTP generated successfully',
      // For development/testing only.
      otp,
    };
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string) {
    const savedOtp = await (this.prisma as any).otp.findUnique({
      where: { email },
    });

    if (!savedOtp) {
      throw new BadRequestException('OTP not found');
    }

    if (savedOtp.expiresAt.getTime() < Date.now()) {
      await (this.prisma as any).otp.delete({
        where: { email },
      });

      throw new BadRequestException('OTP has expired');
    }

    if (savedOtp.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await (this.prisma as any).otp.delete({
      where: { email },
    });

    return {
      message: 'OTP verified successfully',
      verified: true,
    };
  }
}
