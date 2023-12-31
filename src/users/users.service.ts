import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { UsersRepository } from 'src/datasource/repositories';
import { User } from 'src/datasource/entities';
import { PasswordHasher } from 'src/helpers';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async registerUser(payload: RegisterUserDTO): Promise<string> {
    const userWithSameUsername = await this.usersRepository.getUserByUsername(
      payload.username,
    );

    if (userWithSameUsername)
      throw new BadRequestException('Username already used');

    const user = new User();
    user.username = payload.username;
    user.fullname = payload.fullname;
    user.password = await PasswordHasher.hashPassword(payload.password);

    return await this.usersRepository.addUser(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    delete user.password;
    return user;
  }

  async getUsersWithSimiliarUsername(username: string): Promise<User[]> {
    return this.usersRepository.getUsersWithSimiliarUsername(username);
  }
}
