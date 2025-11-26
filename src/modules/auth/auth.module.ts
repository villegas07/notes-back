import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { PasswordService } from '../../core/security/password.service';
import { TokenService } from '../../core/security/token.service';
import { EmailService } from '../../core/services/email.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, PasswordService, TokenService, EmailService, PrismaService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
