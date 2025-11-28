import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from '../../common/dto/create-note.dto';
import { UpdateNoteDto } from '../../common/dto/update-note.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@ApiTags('Notes')
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva nota' })
  @ApiResponse({ status: 201, description: 'Nota creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Request() req: any, @Body(ValidationPipe) createNoteDto: CreateNoteDto) {
    return this.notesService.create(req.user.sub, createNoteDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtener notas activas del usuario' })
  @ApiResponse({ status: 200, description: 'Notas activas obtenidas correctamente.' })
  async getActive(@Request() req: any) {
    return this.notesService.findActiveByUserId(req.user.sub);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Obtener notas archivadas del usuario' })
  @ApiResponse({ status: 200, description: 'Notas archivadas obtenidas correctamente.' })
  async getArchived(@Request() req: any) {
    return this.notesService.findArchivedByUserId(req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  async update(
    @Request() req: any,
    @Param('id') noteId: string,
    @Body(ValidationPipe) updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(req.user.sub, noteId, updateNoteDto);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archivar una nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota archivada correctamente.' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  async archive(@Request() req: any, @Param('id') noteId: string) {
    return this.notesService.archive(req.user.sub, noteId);
  }

  @Post(':id/unarchive')
  @ApiOperation({ summary: 'Desarchivar una nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota desarchivada correctamente.' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  async unarchive(@Request() req: any, @Param('id') noteId: string) {
    return this.notesService.unarchive(req.user.sub, noteId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  async delete(@Request() req: any, @Param('id') noteId: string) {
    return this.notesService.delete(req.user.sub, noteId);
  }
}
