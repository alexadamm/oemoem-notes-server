import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from 'src/datasource/repositories';
import { NotePayloadDTO } from './dtos';
import { Note } from 'src/datasource/entities';
import { randomUUID } from 'crypto';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  addNewNote(payload: NotePayloadDTO): string {
    const newNote = new Note();
    newNote.id = randomUUID();
    newNote.title = payload.title ?? 'Untitled';
    newNote.body = payload.body ?? '';
    newNote.tags = payload.tags || [];
    return this.notesRepository.addNote(newNote);
  }

  getAllNotes(): Note[] {
    return this.notesRepository.getNotes();
  }

  getNoteById(id: string): Note {
    const note = this.notesRepository.getNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  updateNoteById(id: string, payload: NotePayloadDTO): Note {
    const note = this.getNoteById(id);
    note.body = payload.body ?? note.body;
    note.tags = payload.tags ?? note.tags;
    note.title = payload.title ?? note.title;

    this.notesRepository.updateNoteById(id, note);

    return this.notesRepository.getNoteById(id);
  }

  deleteNoteById(id: string): void {
    this.getNoteById(id);
    this.notesRepository.deleteNoteById(id);
  }
}
