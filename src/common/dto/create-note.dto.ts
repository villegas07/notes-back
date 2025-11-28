import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Ejemplo de payload para la creación de una nota:
 * {
 *   "title": "Título de la nota",
 *   "description": "Descripción de la nota"
 * }
 */
export class CreateNoteDto {
  @ApiProperty({ example: 'Título de la nota', description: 'Título de la nota', minLength: 1, maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Descripción de la nota', description: 'Descripción opcional de la nota', maxLength: 5000 })
  @IsString()
  @MaxLength(5000)
  description?: string;
}

