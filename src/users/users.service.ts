import { UsersRepository } from 'src/datasource/repositories/users.repository';
import { UserFullnames, UserPayload } from './dtos/user-payload.dto';
import { User } from 'src/datasource/entities/users.entity';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async addUsers(users: UserPayload): Promise<User[]> {
    const newUsers = users.data.map(this.mapDTOToUser);

    return this.usersRepository.addUsers(newUsers);
  }

  mapDTOToUser(user: UserFullnames): User {
    const newUser = new User();
    newUser.fullname = user.fullname;
    newUser.key = crypto.randomBytes(32).toString('base64');
    return newUser;
  }
}
