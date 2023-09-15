import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenPayloadDTO {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
