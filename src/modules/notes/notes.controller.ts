import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from '../../common/dto/create-note.dto';
import { UpdateNoteDto } from '../../common/dto/update-note.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  async create(@Request() req: any, @Body(ValidationPipe) createNoteDto: CreateNoteDto) {
    return this.notesService.create(req.user.sub, createNoteDto);
  }

  @Get('active')
  async getActive(@Request() req: any) {
    return this.notesService.findActiveByUserId(req.user.sub);
  }

  @Get('archived')
  async getArchived(@Request() req: any) {
    return this.notesService.findArchivedByUserId(req.user.sub);
  }

  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') noteId: string,
    @Body(ValidationPipe) updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(req.user.sub, noteId, updateNoteDto);
  }

  @Post(':id/archive')
  async archive(@Request() req: any, @Param('id') noteId: string) {
    return this.notesService.archive(req.user.sub, noteId);
  }

  @Post(':id/unarchive')
  async unarchive(@Request() req: any, @Param('id') noteId: string) {
    return this.notesService.unarchive(req.user.sub, noteId);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') noteId: string) {
    return this.notesService.delete(req.user.sub, noteId);
  }
}
