import { InjectEntityManager } from '@nestjs/typeorm';
import { Note } from '../entities';
import { EntityManager, Repository } from 'typeorm';

export class NotesRepository {
  noteDatasource: Repository<Note>;
  constructor(
    @InjectEntityManager() private readonly datasource: EntityManager,
  ) {
    this.noteDatasource = datasource.getRepository(Note);
  }

  async addNote(note: Note): Promise<string> {
    const addedNote = await this.noteDatasource.save(note);

    return addedNote.id;
  }

  async getNotes(): Promise<Note[]> {
    const notes = await this.noteDatasource.find();
    return notes;
  }

  async getNoteById(id: string): Promise<Note> {
    const note = this.noteDatasource.findOneBy({ id });
    return note;
  }

  async updateNoteById(id: string, note: Note): Promise<void> {
    await this.noteDatasource.save({
      id,
      title: note.title,
      body: note.body,
      tags: note.tags,
    });
  }

  async deleteNoteById(id: string): Promise<void> {
    await this.noteDatasource.delete({ id });
  }
}
