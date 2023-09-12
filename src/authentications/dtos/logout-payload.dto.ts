import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutPayloadDTO {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
