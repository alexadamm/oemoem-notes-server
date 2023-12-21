import { InjectEntityManager } from '@nestjs/typeorm';
import { Note } from '../entities';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

export class NotesRepository {
  noteDatasource: Repository<Note>;
  constructor(
    @InjectEntityManager() private readonly datasource: EntityManager,
  ) {
    this.noteDatasource = datasource.getRepository(Note);
  }

  async addNote(note: DeepPartial<Note>): Promise<string> {
    const addedNote = await this.noteDatasource.save(note);

    return addedNote.id;
  }

  async getNotesByUserAndDirectoryId(
    directoryId: string,
    userId: string,
  ): Promise<Note[]> {
    return this.noteDatasource.find({
      where: { directoryId, ownerId: userId },
      select: {
        id: true,
        title: true,
        directoryId: true,
      },
    });
  }

  async getNoteById(id: string): Promise<Note> {
    return this.noteDatasource.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        directoryId: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        owner: {
          fullname: true,
        },
      },
      relations: {
        owner: true,
      },
    });
  }

  async updateNoteById(id: string, note: DeepPartial<Note>): Promise<void> {
    await this.noteDatasource.update(id, note);
  }

  async deleteNoteById(id: string): Promise<void> {
    await this.noteDatasource.delete({ id });
  }
}
