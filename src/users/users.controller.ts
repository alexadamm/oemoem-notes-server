import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserPayload } from './dtos/user-payload.dto';
import { ResponseWrapper } from 'src/helpers';

@Controller('bagustolol')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async postUsers(@Body() body: UserPayload): Promise<ResponseWrapper> {
    const users = await this.usersService.addUsers(body);

    return ResponseWrapper.success('Successfully added users', users);
  }
}
