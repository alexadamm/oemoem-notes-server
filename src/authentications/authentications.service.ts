import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/datasource/repositories';
import { AuthenticationsRepository } from 'src/datasource/repositories/authentications.repository';
import { LoginPayloadDTO, AuthTokenDTO } from './dtos';
import { PasswordHasher } from 'src/helpers';
import { Authentication } from 'src/datasource/entities';
import { JwtService } from '@nestjs/jwt';

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
