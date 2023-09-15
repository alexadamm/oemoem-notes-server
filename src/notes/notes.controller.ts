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
import { ResponseWrapper } from 'src/helpers';
import { NotesService } from './notes.service';
import { NotePayloadDTO } from './dtos';
import { AuthGuard } from 'src/commons/auth-guard';
import { AuthorizedRequestDTO } from 'src/commons/dto/authorized-request.dto';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async postNotes(
    @Body() payload: NotePayloadDTO,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<ResponseWrapper> {
    const noteId = await this.notesService.addNewNote(payload, req.user);

    return ResponseWrapper.success('Note added successfully', { noteId });
  }

  @Get()
  async getNotes(@Req() req: AuthorizedRequestDTO): Promise<ResponseWrapper> {
    const notes = await this.notesService.getAllNotes(req.user);
    return ResponseWrapper.success('Notes fetched successfully', { notes });
  }

  @Get(':id')
  async getNoteById(
    @Param('id') id: string,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<ResponseWrapper> {
    const note = await this.notesService.getNoteById(id, req.user);
    return ResponseWrapper.success('Note fetched successfully', { note });
  }

  @Put(':id')
  async putNoteById(
    @Param('id') id: string,
    @Body() payload: NotePayloadDTO,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<ResponseWrapper> {
    const note = await this.notesService.updateNoteById(id, payload, req.user);
    return ResponseWrapper.success('Note updated successfully', note);
  }

  @Delete(':id')
  async deleteNoteById(
    @Param('id') id: string,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<ResponseWrapper> {
    await this.notesService.deleteNoteById(id, req.user);

    return ResponseWrapper.success('Note deleted successfully');
  }
}
