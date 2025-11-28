import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener saludo de la API' })
  @ApiResponse({ status: 200, description: 'Saludo exitoso.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
