import { Module } from '@nestjs/common';
import { NotesRepository } from './repositories';

const repositories = [NotesRepository];
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class DatasourceModule {}
