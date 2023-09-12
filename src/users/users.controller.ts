import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { ResponseWrapper } from 'src/helpers';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async postUsers(@Body() payload: RegisterUserDTO): Promise<ResponseWrapper> {
    const addedUser = await this.usersService.registerUser(payload);

    return ResponseWrapper.success('User added successfully', { addedUser });
  }
}
