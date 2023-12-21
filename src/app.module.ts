import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { DirectoryModule } from './directories/directory.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NotesModule, DirectoryModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
