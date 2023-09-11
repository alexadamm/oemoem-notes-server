import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from 'src/datasource/repositories';
import { NotePayloadDTO } from './dtos';
import { Note } from 'src/datasource/entities';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async addNewNote(payload: NotePayloadDTO): Promise<string> {
    const newNote = new Note();
    newNote.title = payload.title ?? 'Untitled';
    newNote.body = payload.body ?? '';
    newNote.tags = payload.tags || [];
    return this.notesRepository.addNote(newNote);
  }

  async getAllNotes(): Promise<Note[]> {
    return this.notesRepository.getNotes();
  }

  async getNoteById(id: string): Promise<Note> {
    const note = await this.notesRepository.getNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async updateNoteById(id: string, payload: NotePayloadDTO): Promise<Note> {
    const note = await this.getNoteById(id);
    note.body = payload.body ?? note.body;
    note.tags = payload.tags ?? note.tags;
    note.title = payload.title ?? note.title;

    this.notesRepository.updateNoteById(id, note);

    return this.notesRepository.getNoteById(id);
  }

  async deleteNoteById(id: string): Promise<void> {
    this.getNoteById(id);
    this.notesRepository.deleteNoteById(id);
  }
}
