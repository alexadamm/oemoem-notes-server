import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DirectoryPayload {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}
