import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DirectoriesRepository } from 'src/datasource/repositories/directories.repository';
import { DirectoryPayload } from './dtos/directory-payload.dto';
import { Directory } from 'src/datasource/entities/directories.entity';

@Injectable()
export class DirectoryService {
  constructor(private readonly dirRepository: DirectoriesRepository) {}

  async addDirectory(
    payload: DirectoryPayload,
    userId: string,
  ): Promise<string> {
    const newDir = new Directory();
    newDir.title = payload.title;
    newDir.ownerId = userId;

    if (payload.parentId) {
      await this.getDirectoryById(payload.parentId, userId);

      newDir.parentId = payload.parentId;
    }

    return this.dirRepository.addDirectory(newDir);
  }

  async getAllDirectories(userId: string): Promise<Directory[]> {
    const dirs = await this.dirRepository.getAllDirectories(userId);

    const parents: Directory[] = [];
    let i = 0;
    while (dirs.length > i) {
      const dir = dirs[i];
      if (!dir.parentId) {
        parents.push(dir);
        dirs.splice(i, 1);
      } else i++;
    }

    for (const parent of parents) {
      parent.children = this.getChildren(parent, dirs);
    }

    return parents;
  }

  private getChildren(parent: Directory, dirs: Directory[]): Directory[] {
    const children: Directory[] = [];

    let i = 0;
    while (dirs.length > i) {
      const directory = dirs[i];
      if (directory.parentId === parent.id) {
        const child = directory;
        dirs.splice(i, 1);
        child.children = this.getChildren(child, dirs);
        children.push(child);
      } else i++;
    }

    return children;
  }

  async getDirectoryById(id: string, userId: string): Promise<Directory> {
    const dir = await this.dirRepository.getDirectoryById(id);
    if (!dir) throw new NotFoundException('Directory not found');
    if (dir.ownerId !== userId)
      throw new ForbiddenException('You are not allowed to access this dir');

    return dir;
  }

  async updateDirectoryById(
    id: string,
    payload: DirectoryPayload,
    userId: string,
  ): Promise<Directory> {
    const dir = await this.getDirectoryById(id, userId);
    dir.title = payload.title ?? dir.title;
    dir.parentId = payload.parentId ?? dir.parentId;

    this.dirRepository.updateDirectoryById(id, dir);

    return this.dirRepository.getDirectoryById(id);
  }

  async deleteDirById(id: string, userId: string): Promise<void> {
    await this.getDirectoryById(id, userId);
    this.dirRepository.deleteDirectoryById(id);
  }
}
