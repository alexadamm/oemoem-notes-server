import { Note } from '../entities';

export class NotesRepository {
  noteDatasource: Note[];
  constructor() {
    this.noteDatasource = [];
  }

  addNote(note: Note): string {
    this.noteDatasource.push(note);
    return note.id;
  }

  getNotes(): Note[] {
    return this.noteDatasource;
  }

  getNoteById(id: string): Note {
    return this.noteDatasource.find((note) => note.id === id);
  }

  updateNoteById(id: string, newNote: Note): void {
    for (const note of this.noteDatasource) {
      if (note.id === id) {
        note.body = newNote.body ?? note.body;
        note.tags = newNote.tags ?? note.tags;
        note.title = newNote.title ?? note.title;
      }
    }
  }

  deleteNoteById(id: string): void {
    this.noteDatasource = this.noteDatasource.filter((note) => note.id !== id);
    console.log(this.noteDatasource);
  }
}
