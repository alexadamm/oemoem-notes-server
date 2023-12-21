import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities/users.entity';

export class UsersRepository {
  usersDatasource: Repository<User>;
  constructor(
    @InjectEntityManager() private readonly datasource: EntityManager,
  ) {
    this.usersDatasource = datasource.getRepository(User);
  }

  async addUsers(user: User[]): Promise<User[]> {
    try {
      const addedUsers = await this.usersDatasource.save(user);

      return addedUsers;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id: string): Promise<User> {
    return this.usersDatasource.findOneBy({ id });
  }

  async getUserByKey(key: string): Promise<User> {
    return this.usersDatasource.findOne({
      where: { key },
      select: { id: true },
    });
  }
}
