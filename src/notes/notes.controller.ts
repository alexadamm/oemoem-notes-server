import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteInteractionPayloadDTO, NotePayloadDTO } from './dtos';
import { AuthGuard } from 'src/commons/auth-guard';
import { AuthorizedRequestDTO } from 'src/commons/dto/authorized-request.dto';
import { Note } from 'src/datasource/entities';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async postNotes(
    @Body() payload: NotePayloadDTO,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<string> {
    const noteId = await this.notesService.addNewNote(payload, req.userId);

    return noteId;
  }

  @Get()
  async getNotes(
    @Req() req: AuthorizedRequestDTO,
    @Body() body: NoteInteractionPayloadDTO,
  ): Promise<Note[]> {
    const notes = await this.notesService.getAllNotes(body, req.userId);
    return notes;
  }

  @Get(':id')
  async getNoteById(
    @Param('id') id: string,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<Note> {
    const note = await this.notesService.getNoteById(id, req.userId);
    return note;
  }

  @Put(':id')
  async putNoteById(
    @Param('id') id: string,
    @Body() payload: NotePayloadDTO,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<Note> {
    const note = await this.notesService.updateNoteById(
      id,
      payload,
      req.userId,
    );
    return note;
  }

  @Delete(':id')
  async deleteNoteById(
    @Param('id') id: string,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<void> {
    await this.notesService.deleteNoteById(id, req.userId);
  }
}
