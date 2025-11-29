import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateNoteInput {
  title: string;
  description?: string;
  userId: string;
}

export interface UpdateNoteInput {
  title?: string;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  description: string | null;
  isArchived: boolean;
  isActive: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NotesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(input: CreateNoteInput): Promise<Note> {
    return this.prismaService.note.create({
      data: {
        title: input.title,
        description: input.description,
        userId: input.userId,
        isActive: true,
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    }) as unknown as Promise<Note>;
  }

  async findById(id: string, userId: string): Promise<Note | null> {
    return this.prismaService.note.findFirst({
      where: { id, userId, isActive: true },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    }) as unknown as Promise<Note | null>;
  }

  async findActiveByUserId(userId: string): Promise<Note[]> {
    return this.prismaService.note.findMany({
      where: { userId, isArchived: false, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    }) as unknown as Promise<Note[]>;
  }

  async findArchivedByUserId(userId: string): Promise<Note[]> {
    return this.prismaService.note.findMany({
      where: { userId, isArchived: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    }) as unknown as Promise<Note[]>;
  }

  async update(id: string, userId: string, input: UpdateNoteInput): Promise<Note | null> {
    const note = await this.prismaService.note.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!note) return null;
    
    return this.prismaService.note.update({
      where: { id },
      data: input,
    }) as unknown as Promise<Note>;
  }

  async archive(id: string, userId: string): Promise<Note | null> {
    const note = await this.prismaService.note.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!note) return null;

    return this.prismaService.note.update({
      where: { id },
      data: { isArchived: true },
    }) as unknown as Promise<Note>;
  }

  async unarchive(id: string, userId: string): Promise<Note | null> {
    const note = await this.prismaService.note.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!note) return null;

    return this.prismaService.note.update({
      where: { id },
      data: { isArchived: false },
    }) as unknown as Promise<Note>;
  }

  async delete(id: string, userId: string): Promise<Note | null> {
    // Soft delete: solo marca como inactivo
    const note = await this.prismaService.note.findFirst({
      where: { id, userId, isActive: true },
    });
    if (!note) return null;

    return this.prismaService.note.update({
      where: { id },
      data: { isActive: false },
    }) as unknown as Promise<Note>;
  }
}
