import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'token123', description: 'Token de recuperación de contraseña' })
  @IsString()
  @MinLength(1)
  resetToken: string;

  @ApiProperty({ example: 'nuevaPassword123', description: 'Nueva contraseña (mínimo 8 caracteres)', minLength: 8, maxLength: 50 })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;
}
