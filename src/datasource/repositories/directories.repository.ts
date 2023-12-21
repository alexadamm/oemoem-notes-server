import { InjectEntityManager } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Directory } from '../entities/directories.entity';

export class DirectoriesRepository {
  directoryDatasource: Repository<Directory>;
  constructor(
    @InjectEntityManager() private readonly datasource: EntityManager,
  ) {
    this.directoryDatasource = datasource.getRepository(Directory);
  }

  async addDirectory(directory: DeepPartial<Directory>): Promise<string> {
    const result = await this.directoryDatasource.save(directory);
    return result.id;
  }

  async getAllDirectories(userId: string): Promise<Directory[]> {
    return this.directoryDatasource.find({
      where: { ownerId: userId },
    });
  }

  async getDirectoryById(id: string): Promise<Directory> {
    return this.directoryDatasource.findOne({
      where: { id },
      select: { parentId: true, ownerId: true },
    });
  }

  async updateDirectoryById(
    id: string,
    directory: DeepPartial<Directory>,
  ): Promise<void> {
    await this.directoryDatasource.update(id, directory);
  }

  async deleteDirectoryById(id: string): Promise<void> {
    await this.directoryDatasource.delete(id);
  }
}
