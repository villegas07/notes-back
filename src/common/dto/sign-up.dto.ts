import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario (8-50 caracteres)', minLength: 8, maxLength: 50 })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(50, {
    message: 'Password must be at most 50 characters long',
  })
  password: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2, {
    message: 'First name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'First name must be at most 100 characters long',
  })
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2, {
    message: 'Last name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'Last name must be at most 100 characters long',
  })
  lastName: string;
}
