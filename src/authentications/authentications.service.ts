import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/datasource/repositories';
import { AuthenticationsRepository } from 'src/datasource/repositories/authentications.repository';
import { LoginPayloadDTO, AuthTokensDTO, LogoutPayloadDTO } from './dtos';
import { PasswordHasher } from 'src/helpers';
import { Authentication } from 'src/datasource/entities';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from 'src/commons/dto/jwt-payload.dto';
import { RefreshTokenPayloadDTO } from './dtos/refresh-token.payload.dto';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthenticationsRepository,
  ) {}

  async loginUser(payload: LoginPayloadDTO): Promise<AuthTokensDTO> {
    const { username, password } = payload;

    const user = await this.usersRepository.getUserByUsername(username);
    if (!user) throw new BadRequestException('Invalid username');

    const isPasswordVerified = await PasswordHasher.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordVerified)
      throw new UnauthorizedException('Invalid password');

    const newAuth = new Authentication();
    newAuth.user = user;

    const addedAuthId = await this.authRepository.insertNewAuth(newAuth);

    return this.generateTokens(username, user.id, addedAuthId);
  }

  async logoutUser(payload: LogoutPayloadDTO, userId: string): Promise<void> {
    const { refreshToken } = payload;
    try {
      this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new BadRequestException('Invalid refresh token');
    }
    const tokenPayload: JwtPayloadDTO = this.jwtService.decode(
      refreshToken,
    ) as JwtPayloadDTO;

    if (tokenPayload.sub !== userId)
      throw new ForbiddenException(
        'You are not allowed to log out as another user',
      );

    await this.authRepository.deleteAuth(tokenPayload.jti);
  }

  async updateAccessToken(
    payload: RefreshTokenPayloadDTO,
  ): Promise<AuthTokensDTO> {
    const { refreshToken } = payload;
    try {
      this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new BadRequestException('Invalid refresh token');
    }
    const tokenPayload: JwtPayloadDTO = this.jwtService.decode(
      refreshToken,
    ) as JwtPayloadDTO;

    const session = await this.authRepository.getAuth(
      tokenPayload.jti,
      tokenPayload.sub,
    );

    if (!session) {
      throw new BadRequestException('User is already logged out');
    }

    const newAccessToken = this.generateAccessToken(
      tokenPayload.sub,
      tokenPayload.username,
    );

    const result = new AuthTokensDTO();
    result.accessToken = newAccessToken;

    return result;
  }

  generateTokens(
    username: string,
    subject: string,
    jwtid: string,
  ): AuthTokensDTO {
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
