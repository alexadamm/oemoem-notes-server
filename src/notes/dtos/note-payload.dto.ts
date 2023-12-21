import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class NoteInteractionPayloadDTO {
  @IsNotEmpty()
  @IsString()
  directoryId: string;
}

export class NotePayloadDTO extends NoteInteractionPayloadDTO {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'title is too long' })
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;
}
