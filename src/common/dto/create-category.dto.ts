import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Trabajo', description: 'Nombre de la categoría', minLength: 1, maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '#10b981', description: 'Color de la categoría (hex, rgb, etc)', minLength: 4, maxLength: 8, required: true })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  color: string;
}
