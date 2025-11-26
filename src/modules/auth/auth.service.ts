import { Injectable } from '@nestjs/common';
import { PasswordService } from '../../core/security/password.service';
import { TokenService } from '../../core/security/token.service';
import { EmailService } from '../../core/services/email.service';
import { UsersRepository } from '../users/users.repository';
import { ConflictException, UnauthorizedException, ValidationException } from '../../core/exceptions/app.exception';
import { SignUpDto } from '../../common/dto/sign-up.dto';
import { SignInDto } from '../../common/dto/sign-in.dto';
import { ForgotPasswordDto } from '../../common/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../common/dto/reset-password.dto';
import { VerifyEmailDto } from '../../common/dto/verify-email.dto';
import { ResendVerificationDto } from '../../common/dto/resend-verification.dto';
import { PrismaService } from '../../database/prisma.service';
import * as crypto from 'crypto';

export interface AuthResponse {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private usersRepository: UsersRepository,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  /**
   * Registra un nuevo usuario y envía email de verificación
   */
  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const existingUser = await this.usersRepository.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.passwordService.hashPassword(signUpDto.password);
    
    // Generar token de verificación de email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        password: hashedPassword,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        isEmailVerified: false,
        emailVerificationToken: verificationTokenHash,
        emailVerificationExpires: emailVerificationExpires,
      },
    });

    // Enviar email de verificación
    try {
      await this.emailService.sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      // Si falla el email, eliminar el usuario creado
      await this.prisma.user.delete({ where: { id: user.id } });
      throw new Error('Failed to send verification email. Please try again.');
    }

    return { 
      message: 'Account created successfully. Please verify your email to complete registration.' 
    };
  }

  /**
   * Verifica el email del usuario con el token proporcionado
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<AuthResponse> {
    const verificationTokenHash = crypto.createHash('sha256')
      .update(verifyEmailDto.verificationToken)
      .digest('hex');

    // Buscar usuario con el token válido
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: verificationTokenHash,
        emailVerificationExpires: {
          gt: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      throw new ValidationException('Invalid or expired verification token');
    }

    // Actualizar usuario como verificado
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    // Generar token de acceso
    const accessToken = this.tokenService.generateToken(user.id, user.email);
    return { accessToken };
  }

  /**
   * Reenvía email de verificación
   */
  async resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findByEmail(resendVerificationDto.email);

    if (!user) {
      return { message: 'If email exists, a verification link has been sent' };
    }

    if (user.isEmailVerified) {
      throw new ValidationException('Email is already verified');
    }

    // Generar nuevo token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Actualizar token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationTokenHash,
        emailVerificationExpires: emailVerificationExpires,
      },
    });

    // Enviar email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Verification email has been sent' };
  }

  /**
   * Inicia sesión (requiere email verificado)
   */
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar que el email esté verificado
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before signing in');
    }

    const isPasswordValid = await this.passwordService.comparePassword(signInDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.tokenService.generateToken(user.id, user.email);
    return { accessToken };
  }

  /**
   * Solicita recuperación de contraseña
   * Genera un token y envía un email con el link de recuperación
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersRepository.findByEmail(forgotPasswordDto.email);
    
    // Por seguridad, no revelar si el email existe o no
    if (!user) {
      return { message: 'If email exists, a recovery link has been sent' };
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar token hash en BD
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: resetTokenExpires,
      },
    });

    // Crear registro en historial
    await this.prisma.passwordResetHistory.create({
      data: {
        userId: user.id,
        resetToken: resetTokenHash,
        resetTokenExpires: resetTokenExpires,
      },
    });

    // Enviar email con token
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If email exists, a recovery link has been sent' };
  }

  /**
   * Resetea la contraseña con el token proporcionado
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const resetTokenHash = crypto.createHash('sha256').update(resetPasswordDto.resetToken).digest('hex');

    // Buscar usuario con el token válido
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: {
          gt: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      throw new ValidationException('Invalid or expired reset token');
    }

    // Hashear nueva contraseña
    const hashedPassword = await this.passwordService.hashPassword(resetPasswordDto.newPassword);

    // Actualizar contraseña y limpiar token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    // Marcar el intento como usado en el historial
    await this.prisma.passwordResetHistory.update({
      where: { resetToken: resetTokenHash },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    return { message: 'Password reset successfully' };
  }
}
