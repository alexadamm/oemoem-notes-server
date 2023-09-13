import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ResponseWrapper } from 'src/helpers';
import { NotesService } from './notes.service';
import { NotePayloadDTO } from './dtos';
import { AuthGuard } from 'src/commons/auth-guard';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async postNotes(@Body() payload: NotePayloadDTO): Promise<ResponseWrapper> {
    const noteId = await this.notesService.addNewNote(payload);

    return ResponseWrapper.success('Note added successfully', { noteId });
  }

  @Get()
  async getNotes(): Promise<ResponseWrapper> {
    const notes = await this.notesService.getAllNotes();
    return ResponseWrapper.success('Notes fetched successfully', { notes });
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<ResponseWrapper> {
    const note = await this.notesService.getNoteById(id);
    return ResponseWrapper.success('Note fetched successfully', { note });
  }

  @Put(':id')
  async putNoteById(
    @Param('id') id: string,
    @Body() payload: NotePayloadDTO,
  ): Promise<ResponseWrapper> {
    const updatedNote = await this.notesService.updateNoteById(id, payload);
    return ResponseWrapper.success('Note updated successfully', updatedNote);
  }

  @Delete(':id')
  async deleteNoteById(@Param('id') id: string): Promise<ResponseWrapper> {
    await this.notesService.deleteNoteById(id);

    return ResponseWrapper.success('Note deleted successfully');
  }
}
