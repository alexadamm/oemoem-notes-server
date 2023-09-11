import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ResponseWrapper } from 'src/helpers';
import { NotesService } from './notes.service';
import { NotePayloadDTO } from './dtos';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Post()
  postNotes(@Body() payload: NotePayloadDTO): ResponseWrapper {
    const noteId = this.notesService.addNewNote(payload);

    return ResponseWrapper.success('Note added successfully', { noteId });
  }

  @Get()
  getNotes(): ResponseWrapper {
    const notes = this.notesService.getAllNotes();
    return ResponseWrapper.success('Notes fetched successfully', { notes });
  }

  @Get(':id')
  getNoteById(@Param('id') id: string): ResponseWrapper {
    const note = this.notesService.getNoteById(id);
    return ResponseWrapper.success('Note fetched successfully', { note });
  }

  @Put(':id')
  putNoteById(
    @Param('id') id: string,
    @Body() payload: NotePayloadDTO,
  ): ResponseWrapper {
    const updatedNote = this.notesService.updateNoteById(id, payload);
    return ResponseWrapper.success('Note updated successfully', updatedNote);
  }

  @Delete(':id')
  deleteNoteById(@Param('id') id: string): ResponseWrapper {
    this.notesService.deleteNoteById(id);

    return ResponseWrapper.success('Note deleted successfully');
  }
}
