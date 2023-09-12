import { Module } from '@nestjs/common';
import { NotesRepository, UsersRepository } from './repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationsRepository } from './repositories/authentications.repository';

const repositories = [
  NotesRepository,
  UsersRepository,
  AuthenticationsRepository,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'root',
      password: 'password',
      host: 'localhost',
      port: 3306,
      database: 'db_notes',
      synchronize: true,
      logging: true,
      entities: [__dirname + '/entities/*.entity.{js,ts}'],
    }),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatasourceModule {}
