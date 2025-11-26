import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from '../../common/dto/create-category.dto';
import { ConflictException, NotFoundException } from '../../core/exceptions/app.exception';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoriesRepository: CategoriesRepository;

  const mockCategoriesRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addCategoryToNote: jest.fn(),
    removeCategoryFromNote: jest.fn(),
    getCategoriesByNoteId: jest.fn(),
    getNotesByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: mockCategoriesRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Work' };
      const category = { id: 'cat-1', ...createCategoryDto, createdAt: new Date(), updatedAt: new Date() };

      mockCategoriesRepository.findByName.mockResolvedValue(null);
      mockCategoriesRepository.create.mockResolvedValue(category);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(category);
      expect(categoriesRepository.findByName).toHaveBeenCalledWith(createCategoryDto.name);
      expect(categoriesRepository.create).toHaveBeenCalledWith(createCategoryDto.name);
    });

    it('should throw ConflictException if category already exists', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Work' };

      mockCategoriesRepository.findByName.mockResolvedValue({ id: 'cat-1', name: 'Work' });

      await expect(service.create(createCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [
        { id: 'cat-1', name: 'Work', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockCategoriesRepository.findAll.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(categoriesRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('addCategoryToNote', () => {
    it('should add category to note', async () => {
      const noteId = 'note-1';
      const categoryId = 'cat-1';

      mockCategoriesRepository.addCategoryToNote.mockResolvedValue(undefined);

      await service.addCategoryToNote(noteId, categoryId);

      expect(categoriesRepository.addCategoryToNote).toHaveBeenCalledWith(noteId, categoryId);
    });
  });

  describe('removeCategoryFromNote', () => {
    it('should remove category from note', async () => {
      const noteId = 'note-1';
      const categoryId = 'cat-1';

      mockCategoriesRepository.removeCategoryFromNote.mockResolvedValue(undefined);

      await service.removeCategoryFromNote(noteId, categoryId);

      expect(categoriesRepository.removeCategoryFromNote).toHaveBeenCalledWith(noteId, categoryId);
    });
  });

  describe('getCategoriesByNoteId', () => {
    it('should return categories for a note', async () => {
      const noteId = 'note-1';
      const categories = [
        { id: 'cat-1', name: 'Work', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockCategoriesRepository.getCategoriesByNoteId.mockResolvedValue(categories);

      const result = await service.getCategoriesByNoteId(noteId);

      expect(result).toEqual(categories);
      expect(categoriesRepository.getCategoriesByNoteId).toHaveBeenCalledWith(noteId);
    });
  });

  describe('getNotesByCategory', () => {
    it('should return notes for a category', async () => {
      const categoryId = 'cat-1';
      const notes = [
        {
          id: 'note-1',
          title: 'Note 1',
          description: null,
          isArchived: false,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCategoriesRepository.getNotesByCategory.mockResolvedValue(notes);

      const result = await service.getNotesByCategory(categoryId);

      expect(result).toEqual(notes);
      expect(categoriesRepository.getNotesByCategory).toHaveBeenCalledWith(categoryId);
    });
  });
});
