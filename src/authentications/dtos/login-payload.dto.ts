import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginPayloadDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string;
}
