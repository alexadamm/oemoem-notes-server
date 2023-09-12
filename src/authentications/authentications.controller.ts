import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { ResponseWrapper } from 'src/helpers';
import { LoginPayloadDTO } from './dtos';

@Controller('authentications')
export class AuthenticationsController {
  constructor(private readonly authService: AuthenticationsService) {}

  @Post()
  async postAuthentication(
    @Body() payload: LoginPayloadDTO,
  ): Promise<ResponseWrapper> {
    const result = await this.authService.loginUser(payload);
    return ResponseWrapper.success('User successfully logged in', result);
  }
}
