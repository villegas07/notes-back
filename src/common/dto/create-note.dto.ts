import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(5000)
  description?: string;
}
