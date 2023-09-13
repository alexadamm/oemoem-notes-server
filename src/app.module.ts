import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { AuthenticationsModule } from './authentications/authentications.module';
import { CommonsModule } from './commons/commons.module';

@Module({
  imports: [NotesModule, UsersModule, AuthenticationsModule, CommonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
