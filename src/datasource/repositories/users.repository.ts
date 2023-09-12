import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entities';

export class UsersRepository {
  usersDatasource: Repository<User>;
  constructor(
    @InjectEntityManager() private readonly datasource: EntityManager,
  ) {
    this.usersDatasource = datasource.getRepository(User);
  }

  async addUser(user: User): Promise<User> {
    const addedUser = await this.usersDatasource.save(user);

    return addedUser;
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.usersDatasource.findOneBy({ username });
  }

  async getUserById(id: string): Promise<User> {
    return this.usersDatasource.findOneBy({ id });
  }

  async getUsersWithSimiliarUsername(username: string): Promise<User[]> {
    const users: User[] = await this.usersDatasource.query(
      'SELECT id, username, fullname FROM users WHERE username LIKE ?',
      [`%${username}%`],
    );

    return users;
  }
}
