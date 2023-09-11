import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class NotePayloadDTO {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'title is too long' })
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(10, {
    each: true,
    message: 'tag is too long',
  })
  tags?: string[];

  @IsOptional()
  @IsString()
  body?: string;
}
