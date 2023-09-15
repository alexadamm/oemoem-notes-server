import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { ResponseWrapper } from 'src/helpers';
import { LoginPayloadDTO, LogoutPayloadDTO } from './dtos';
import { AuthGuard } from 'src/commons/auth-guard';
import { AuthorizedRequestDTO } from 'src/commons/dto/authorized-request.dto';
import { RefreshTokenPayloadDTO } from './dtos/refresh-token.payload.dto';

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

  @Delete()
  @UseGuards(AuthGuard)
  async deleteAuthentication(
    @Body() payload: LogoutPayloadDTO,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<ResponseWrapper> {
    await this.authService.logoutUser(payload, req.user.sub);
    return ResponseWrapper.success('User successfully logged out');
  }

  @Put()
  async putAuthenticaton(@Body() payload: RefreshTokenPayloadDTO) {
    const result = await this.authService.updateAccessToken(payload);
    return ResponseWrapper.success('Token successfully updated', result);
  }
}
