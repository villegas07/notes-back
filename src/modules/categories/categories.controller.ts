import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../../common/dto/create-category.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post(':noteId/add/:categoryId')
  async addCategoryToNote(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
  ) {
    await this.categoriesService.addCategoryToNote(noteId, categoryId);
    return { message: 'Category added to note' };
  }

  @Delete(':noteId/remove/:categoryId')
  async removeCategoryFromNote(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
  ) {
    await this.categoriesService.removeCategoryFromNote(noteId, categoryId);
    return { message: 'Category removed from note' };
  }

  @Get('note/:noteId')
  async getCategoriesByNoteId(@Param('noteId') noteId: string) {
    return this.categoriesService.getCategoriesByNoteId(noteId);
  }

  @Get('filter/:categoryId')
  async getNotesByCategory(@Param('categoryId') categoryId: string) {
    return this.categoriesService.getNotesByCategory(categoryId);
  }
}
