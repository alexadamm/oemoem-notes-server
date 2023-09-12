import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string;
}
