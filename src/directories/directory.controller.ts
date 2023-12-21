import {
  Body,
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DirectoryService } from './directory.service';
import { AuthGuard } from 'src/commons/auth-guard';
import { DirectoryPayload } from './dtos/directory-payload.dto';
import { AuthorizedRequestDTO } from 'src/commons/dto/authorized-request.dto';
import { Directory } from 'src/datasource/entities/directories.entity';

@UseGuards(AuthGuard)
@Controller('directories')
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Post()
  async postDirectory(
    @Body() payload: DirectoryPayload,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<string> {
    const directoryId = await this.directoryService.addDirectory(
      payload,
      req.userId,
    );

    return directoryId;
  }

  @Get()
  async getDirectories(@Req() req: AuthorizedRequestDTO): Promise<Directory[]> {
    const directories = await this.directoryService.getAllDirectories(
      req.userId,
    );

    return directories;
  }

  @Put(':id')
  async putDirectoryById(
    @Param('id') id: string,
    @Body() payload: DirectoryPayload,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<Directory> {
    const directory = await this.directoryService.updateDirectoryById(
      id,
      payload,
      req.userId,
    );
    return directory;
  }

  @Delete(':id')
  async deleteDirectoryById(
    @Param('id') id: string,
    @Req() req: AuthorizedRequestDTO,
  ): Promise<void> {
    await this.directoryService.deleteDirById(id, req.userId);
  }
}
