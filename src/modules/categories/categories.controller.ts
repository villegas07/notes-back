import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../../common/dto/create-category.dto';
import { JwtAuthGuard } from '../../core/guards/jwt.guard';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida correctamente.' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post(':noteId/add/:categoryId')
  @ApiOperation({ summary: 'Agregar una categoría a una nota' })
  @ApiResponse({ status: 200, description: 'Categoría agregada a la nota.' })
  @ApiResponse({ status: 404, description: 'Nota o categoría no encontrada.' })
  async addCategoryToNote(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
  ) {
    await this.categoriesService.addCategoryToNote(noteId, categoryId);
    return { message: 'Category added to note' };
  }

  @Delete(':noteId/remove/:categoryId')
  @ApiOperation({ summary: 'Remover una categoría de una nota' })
  @ApiResponse({ status: 200, description: 'Categoría removida de la nota.' })
  @ApiResponse({ status: 404, description: 'Nota o categoría no encontrada.' })
  async removeCategoryFromNote(
    @Param('noteId') noteId: string,
    @Param('categoryId') categoryId: string,
  ) {
    await this.categoriesService.removeCategoryFromNote(noteId, categoryId);
    return { message: 'Category removed from note' };
  }

  @Get('note/:noteId')
  @ApiOperation({ summary: 'Obtener categorías de una nota por ID' })
  @ApiResponse({ status: 200, description: 'Categorías obtenidas correctamente.' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  async getCategoriesByNoteId(@Param('noteId') noteId: string) {
    return this.categoriesService.getCategoriesByNoteId(noteId);
  }

  @Get('filter/:categoryId')
  @ApiOperation({ summary: 'Obtener notas por categoría' })
  @ApiResponse({ status: 200, description: 'Notas obtenidas correctamente.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  async getNotesByCategory(@Param('categoryId') categoryId: string) {
    return this.categoriesService.getNotesByCategory(categoryId);
  }
}
