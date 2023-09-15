import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { ResponseWrapper } from 'src/helpers';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async postUsers(@Body() payload: RegisterUserDTO): Promise<ResponseWrapper> {
    const userId = await this.usersService.registerUser(payload);
    return ResponseWrapper.success('User added successfully', { userId });
  }

  @Get()
  async getUsers(
    @Query('username') username: string,
  ): Promise<ResponseWrapper> {
    const users = await this.usersService.getUsersWithSimiliarUsername(
      username,
    );
    return ResponseWrapper.success('Users found successfully', { users });
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ResponseWrapper> {
    const user = await this.usersService.getUserById(id);

    return ResponseWrapper.success('User found successfully', { user });
  }
}
