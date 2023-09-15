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

  async getNotesByUserId(userId: string): Promise<Note[]> {
    const notes = await this.noteDatasource.findBy({
      owner: {
        id: userId,
      },
    });
    return notes;
  }

  async getNoteById(id: string): Promise<Note> {
    const note = this.noteDatasource
      .createQueryBuilder('notes')
      .leftJoinAndSelect('notes.owner', 'owner')
      .where('notes.id = :id', { id })
      .select(['notes', 'owner.username', 'owner.id'])
      .getOne();
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
