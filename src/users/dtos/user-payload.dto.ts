import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class UserPayload {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UserFullnames)
  data: UserFullnames[];
}

export class UserFullnames {
  @IsString()
  @IsNotEmpty()
  fullname: string;
}
