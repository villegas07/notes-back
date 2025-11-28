import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CategoriesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(name: string, color: string): Promise<Category> {
    return this.prismaService.category.create({
      data: { name, color },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prismaService.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, color: true, createdAt: true, updatedAt: true },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { name },
      select: { id: true, name: true, color: true, createdAt: true, updatedAt: true },
    });
  }

  async update(id: string, name: string, color: string): Promise<Category> {
    return this.prismaService.category.update({
      where: { id },
      data: { name, color },
    });
  }

  async delete(id: string): Promise<Category> {
    return this.prismaService.category.delete({
      where: { id },
    });
  }

  async addCategoryToNote(noteId: string, categoryId: string): Promise<void> {
    await this.prismaService.noteCategory.create({
      data: { noteId, categoryId },
    });
  }

  async removeCategoryFromNote(noteId: string, categoryId: string): Promise<void> {
    await this.prismaService.noteCategory.delete({
      where: { noteId_categoryId: { noteId, categoryId } },
    });
  }

  async getCategoriesByNoteId(noteId: string): Promise<Category[]> {
    const noteCategories = await this.prismaService.noteCategory.findMany({
      where: { noteId },
      include: { category: true },
    });

    return noteCategories.map((nc) => nc.category);
  }

  async getNotesByCategory(categoryId: string): Promise<any[]> {
    const noteCategories = await this.prismaService.noteCategory.findMany({
      where: { categoryId },
      include: { note: true },
    });

    return noteCategories.map((nc) => nc.note);
  }
}
