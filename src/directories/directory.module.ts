import { Module } from '@nestjs/common';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';
import { DatasourceModule } from 'src/datasource/datasource.module';

@Module({
  imports: [DatasourceModule],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class DirectoryModule {}
