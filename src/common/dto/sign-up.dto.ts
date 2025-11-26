import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(50, {
    message: 'Password must be at most 50 characters long',
  })
  password: string;

  @IsString()
  @MinLength(2, {
    message: 'First name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'First name must be at most 100 characters long',
  })
  firstName: string;

  @IsString()
  @MinLength(2, {
    message: 'Last name must be at least 2 characters long',
  })
  @MaxLength(100, {
    message: 'Last name must be at most 100 characters long',
  })
  lastName: string;
}
