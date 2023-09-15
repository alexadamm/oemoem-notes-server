import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotesRepository } from 'src/datasource/repositories';
import { NotePayloadDTO } from './dtos';
import { Note, User } from 'src/datasource/entities';
import { JwtPayloadDTO } from 'src/commons/dto/jwt-payload.dto';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async addNewNote(
    payload: NotePayloadDTO,
    tokenPayload: JwtPayloadDTO,
  ): Promise<string> {
    const owner = new User();
    owner.id = tokenPayload.sub;

    const newNote = new Note();
    newNote.title = payload.title ?? 'Untitled';
    newNote.body = payload.body ?? '';
    newNote.tags = payload.tags || [];
    newNote.owner = owner;
    return this.notesRepository.addNote(newNote);
  }

  async getAllNotes(tokenPayload: JwtPayloadDTO): Promise<Note[]> {
    return this.notesRepository.getNotesByUserId(tokenPayload.sub);
  }

  async getNoteById(id: string, tokenPayload: JwtPayloadDTO): Promise<Note> {
    const note = await this.notesRepository.getNoteById(id);
    if (!note) throw new NotFoundException('Note not found');

    if (note.owner.id !== tokenPayload.sub)
      throw new ForbiddenException('You are not allowed to access this note');

    return note;
  }

  async updateNoteById(
    id: string,
    payload: NotePayloadDTO,
    tokenPayload: JwtPayloadDTO,
  ): Promise<Note> {
    const note = await this.getNoteById(id, tokenPayload);
    note.body = payload.body ?? note.body;
    note.tags = payload.tags ?? note.tags;
    note.title = payload.title ?? note.title;

    this.notesRepository.updateNoteById(id, note);

    return this.notesRepository.getNoteById(id);
  }

  async deleteNoteById(id: string, tokenPayload: JwtPayloadDTO): Promise<void> {
    await this.getNoteById(id, tokenPayload);
    this.notesRepository.deleteNoteById(id);
  }
}
