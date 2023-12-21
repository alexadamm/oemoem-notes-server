import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotesRepository } from 'src/datasource/repositories';
import { NoteInteractionPayloadDTO, NotePayloadDTO } from './dtos';
import { Note } from 'src/datasource/entities';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async addNewNote(payload: NotePayloadDTO, userId: string): Promise<string> {
    const newNote = new Note();
    newNote.title = payload.title ?? 'Untitled';
    newNote.body = payload.body ?? '';
    newNote.ownerId = userId;
    newNote.directoryId = payload.directoryId;

    return this.notesRepository.addNote(newNote);
  }

  async getAllNotes(
    payload: NoteInteractionPayloadDTO,
    userId: string,
  ): Promise<Note[]> {
    return this.notesRepository.getNotesByUserAndDirectoryId(
      payload.directoryId,
      userId,
    );
  }

  async getNoteById(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.getNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    if (note.ownerId !== userId)
      throw new ForbiddenException('You are not allowed to access this note');

    return note;
  }

  async updateNoteById(
    id: string,
    payload: NotePayloadDTO,
    userId: string,
  ): Promise<Note> {
    const note = await this.getNoteById(id, userId);
    note.body = payload.body ?? note.body;
    note.title = payload.title ?? note.title;
    note.directoryId = payload.directoryId;

    this.notesRepository.updateNoteById(id, note);

    return this.notesRepository.getNoteById(id);
  }

  async deleteNoteById(id: string, userId: string): Promise<void> {
    await this.getNoteById(id, userId);
    this.notesRepository.deleteNoteById(id);
  }
}
