import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from '../../common/dto/sign-up.dto';
import { SignInDto } from '../../common/dto/sign-in.dto';
import { ForgotPasswordDto } from '../../common/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../common/dto/reset-password.dto';
import { VerifyEmailDto } from '../../common/dto/verify-email.dto';
import { ResendVerificationDto } from '../../common/dto/resend-verification.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verificar correo electrónico' })
  @ApiResponse({ status: 200, description: 'Correo verificado correctamente.' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado.' })
  async verifyEmail(@Body(ValidationPipe) verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Reenviar correo de verificación' })
  @ApiResponse({ status: 200, description: 'Correo de verificación reenviado.' })
  @ApiResponse({ status: 400, description: 'Correo inválido o usuario ya verificado.' })
  async resendVerification(@Body(ValidationPipe) resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerification(resendVerificationDto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({ status: 201, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'Correo de recuperación enviado.' })
  @ApiResponse({ status: 400, description: 'Correo inválido.' })
  async forgotPassword(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida correctamente.' })
  @ApiResponse({ status: 400, description: 'Token inválido o contraseña inválida.' })
  async resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
