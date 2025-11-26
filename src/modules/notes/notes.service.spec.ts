import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from '../../common/dto/create-note.dto';
import { UpdateNoteDto } from '../../common/dto/update-note.dto';
import { NotFoundException } from '../../core/exceptions/app.exception';

describe('NotesService', () => {
  let service: NotesService;
  let notesRepository: NotesRepository;

  const mockNotesRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findActiveByUserId: jest.fn(),
    findArchivedByUserId: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    unarchive: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: NotesRepository, useValue: mockNotesRepository },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    notesRepository = module.get<NotesRepository>(NotesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a note', async () => {
      const userId = 'user-1';
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        description: 'Test Description',
      };

      const createdNote = {
        id: 'note-1',
        ...createNoteDto,
        isArchived: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotesRepository.create.mockResolvedValue(createdNote);

      const result = await service.create(userId, createNoteDto);

      expect(result).toEqual(createdNote);
      expect(notesRepository.create).toHaveBeenCalledWith({
        title: createNoteDto.title,
        description: createNoteDto.description,
        userId,
      });
    });
  });

  describe('findActiveByUserId', () => {
    it('should return active notes for a user', async () => {
      const userId = 'user-1';
      const notes = [
        {
          id: 'note-1',
          title: 'Note 1',
          description: null,
          isArchived: false,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockNotesRepository.findActiveByUserId.mockResolvedValue(notes);

      const result = await service.findActiveByUserId(userId);

      expect(result).toEqual(notes);
      expect(notesRepository.findActiveByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('findArchivedByUserId', () => {
    it('should return archived notes for a user', async () => {
      const userId = 'user-1';
      const notes = [
        {
          id: 'note-1',
          title: 'Note 1',
          description: null,
          isArchived: true,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockNotesRepository.findArchivedByUserId.mockResolvedValue(notes);

      const result = await service.findArchivedByUserId(userId);

      expect(result).toEqual(notes);
      expect(notesRepository.findArchivedByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Title',
      };

      const updatedNote = {
        id: noteId,
        title: 'Updated Title',
        description: null,
        isArchived: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotesRepository.findById.mockResolvedValue(updatedNote);
      mockNotesRepository.update.mockResolvedValue(updatedNote);

      const result = await service.update(userId, noteId, updateNoteDto);

      expect(result).toEqual(updatedNote);
      expect(notesRepository.findById).toHaveBeenCalledWith(noteId, userId);
      expect(notesRepository.update).toHaveBeenCalledWith(noteId, userId, updateNoteDto);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';
      const updateNoteDto: UpdateNoteDto = { title: 'Updated' };

      mockNotesRepository.findById.mockResolvedValue(null);

      await expect(service.update(userId, noteId, updateNoteDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('archive', () => {
    it('should archive a note', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';

      const archivedNote = {
        id: noteId,
        title: 'Note',
        description: null,
        isArchived: true,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotesRepository.findById.mockResolvedValue(archivedNote);
      mockNotesRepository.archive.mockResolvedValue(archivedNote);

      const result = await service.archive(userId, noteId);

      expect(result).toEqual(archivedNote);
      expect(notesRepository.archive).toHaveBeenCalledWith(noteId, userId);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';

      mockNotesRepository.findById.mockResolvedValue(null);

      await expect(service.archive(userId, noteId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('unarchive', () => {
    it('should unarchive a note', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';

      const unarchivedNote = {
        id: noteId,
        title: 'Note',
        description: null,
        isArchived: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotesRepository.findById.mockResolvedValue(unarchivedNote);
      mockNotesRepository.unarchive.mockResolvedValue(unarchivedNote);

      const result = await service.unarchive(userId, noteId);

      expect(result).toEqual(unarchivedNote);
      expect(notesRepository.unarchive).toHaveBeenCalledWith(noteId, userId);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';

      mockNotesRepository.findById.mockResolvedValue(null);

      await expect(service.unarchive(userId, noteId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a note', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';

      const note = {
        id: noteId,
        title: 'Note',
        description: null,
        isArchived: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNotesRepository.findById.mockResolvedValue(note);
      mockNotesRepository.delete.mockResolvedValue(note);

      const result = await service.delete(userId, noteId);

      expect(result).toEqual(note);
      expect(notesRepository.delete).toHaveBeenCalledWith(noteId, userId);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const userId = 'user-1';
      const noteId = 'note-1';

      mockNotesRepository.findById.mockResolvedValue(null);

      await expect(service.delete(userId, noteId)).rejects.toThrow(NotFoundException);
    });
  });
});
