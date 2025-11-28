import { Injectable } from '@nestjs/common';
import { CategoriesRepository, Category } from './categories.repository';
import { CreateCategoryDto } from '../../common/dto/create-category.dto';
import { ConflictException } from '../../core/exceptions/app.exception';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findByName(createCategoryDto.name);
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    return this.categoriesRepository.create(createCategoryDto.name, createCategoryDto.color);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async addCategoryToNote(noteId: string, categoryId: string): Promise<void> {
    return this.categoriesRepository.addCategoryToNote(noteId, categoryId);
  }

  async removeCategoryFromNote(noteId: string, categoryId: string): Promise<void> {
    return this.categoriesRepository.removeCategoryFromNote(noteId, categoryId);
  }

  async getCategoriesByNoteId(noteId: string): Promise<Category[]> {
    return this.categoriesRepository.getCategoriesByNoteId(noteId);
  }

  async getNotesByCategory(categoryId: string): Promise<any[]> {
    return this.categoriesRepository.getNotesByCategory(categoryId);
  }
}
