import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener saludo de la API' })
  @ApiResponse({ status: 200, description: 'Saludo exitoso.' })
  getHello(): string {
    return this.appService.getHello();
  }

  // Endpoint temporal para limpiar la base de datos
  @Post('clean-db')
  async cleanDb(): Promise<{ message: string }> {
    // Elimina todos los usuarios y datos relacionados
    await this.prisma.user.deleteMany();
    await this.prisma.passwordResetHistory.deleteMany();
    // Agrega aquí otras tablas si es necesario
    return { message: 'Base de datos limpiada correctamente.' };
  }
}
