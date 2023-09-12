import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { UsersRepository } from 'src/datasource/repositories';
import { User } from 'src/datasource/entities';
import { PasswordHasher } from 'src/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async registerUser(payload: RegisterUserDTO): Promise<User> {
    const userWithSameUsername = await this.usersRepository.getUserByUsername(
      payload.username,
    );

    if (userWithSameUsername)
      throw new BadRequestException('Username already used');

    const user = new User();
    user.username = payload.username;
    user.fullname = payload.fullname;
    user.password = await PasswordHasher.hashPassword(payload.password);

    const addedUser = await this.usersRepository.addUser(user);

    delete addedUser.password;

    return addedUser;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);
    delete user.password;
    return user;
  }

  async getUsersWithSimiliarUsername(username: string): Promise<User[]> {
    return this.usersRepository.getUsersWithSimiliarUsername(username);
  }
}
