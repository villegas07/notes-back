import { Injectable } from '@nestjs/common';
import { NotesRepository, Note } from './notes.repository';
import { CreateNoteDto } from '../../common/dto/create-note.dto';
import { UpdateNoteDto } from '../../common/dto/update-note.dto';
import { NotFoundException } from '../../core/exceptions/app.exception';

@Injectable()
export class NotesService {
  constructor(private notesRepository: NotesRepository) {}

  async create(userId: string, createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.create({
      title: createNoteDto.title,
      description: createNoteDto.description,
      userId,
    });
  }

  async findActiveByUserId(userId: string): Promise<Note[]> {
    return this.notesRepository.findActiveByUserId(userId);
  }

  async findArchivedByUserId(userId: string): Promise<Note[]> {
    return this.notesRepository.findArchivedByUserId(userId);
  }

  async update(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.notesRepository.findById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const updated = await this.notesRepository.update(noteId, userId, updateNoteDto);
    return updated!;
  }

  async archive(userId: string, noteId: string): Promise<Note> {
    const note = await this.notesRepository.findById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const archived = await this.notesRepository.archive(noteId, userId);
    return archived!;
  }

  async unarchive(userId: string, noteId: string): Promise<Note> {
    const note = await this.notesRepository.findById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const unarchived = await this.notesRepository.unarchive(noteId, userId);
    return unarchived!;
  }

  async delete(userId: string, noteId: string): Promise<Note> {
    const note = await this.notesRepository.findById(noteId, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const deleted = await this.notesRepository.delete(noteId, userId);
    return deleted!;
  }
}
