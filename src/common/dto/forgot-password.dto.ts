import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'Correo electrónico para recuperar contraseña' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

