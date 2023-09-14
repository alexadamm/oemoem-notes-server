import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from 'src/datasource/repositories';
import { AuthenticationsRepository } from 'src/datasource/repositories/authentications.repository';
import { LoginPayloadDTO, AuthTokenDTO, LogoutPayloadDTO } from './dtos';
import { PasswordHasher } from 'src/helpers';
import { Authentication } from 'src/datasource/entities';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from 'src/commons/dto/jwt-payload.dto';
import { decode } from 'jsonwebtoken';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthenticationsRepository,
  ) {}

  async loginUser(payload: LoginPayloadDTO): Promise<AuthTokenDTO> {
    const { username, password } = payload;

    const user = await this.usersRepository.getUserByUsername(username);
    if (!user) throw new BadRequestException('Invalid username');

    const isPasswordVerified = await PasswordHasher.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordVerified) throw new BadRequestException('Invalid password');

    const newAuth = new Authentication();
    newAuth.user = user;

    const addedAuthId = await this.authRepository.insertNewAuth(newAuth);

    return this.generateTokens(username, user.id, addedAuthId);
  }

  async logoutUser(payload: LogoutPayloadDTO, userId: string): Promise<void> {
    const { refreshToken } = payload;
    const tokenPayload: JwtPayloadDTO = decode(refreshToken) as JwtPayloadDTO;

    if (tokenPayload.sub !== userId)
      throw new ForbiddenException(
        'You are not allowed to log out as another user',
      );

    await this.authRepository.deleteAuth(tokenPayload.jti);
  }

  generateTokens(
    username: string,
    subject: string,
    jwtid: string,
  ): AuthTokenDTO {
    const options = { jwtid, subject };
    const refreshToken = this.jwtService.sign({ username }, options);

    const accessToken = this.generateAccessToken(subject, username);

    return { accessToken, refreshToken };
  }

  generateAccessToken(subject: string, username: string): string {
    const accessToken = this.jwtService.sign(
      { username },
      {
        subject,
        expiresIn: 60 * 10,
      },
    );
    return accessToken;
  }
}
