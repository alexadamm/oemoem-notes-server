import { Module } from '@nestjs/common';
import { DatasourceModule } from 'src/datasource/datasource.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [DatasourceModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
