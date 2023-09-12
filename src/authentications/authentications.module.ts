import { Module } from '@nestjs/common';
import { AuthenticationsService } from './authentications.service';
import { AuthenticationsController } from './authentications.controller';
import { DatasourceModule } from 'src/datasource/datasource.module';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SECRET,
} from 'src/helpers';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        algorithm: JWT_ALGORITHM,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    }),
    DatasourceModule,
  ],
  providers: [AuthenticationsService],
  controllers: [AuthenticationsController],
})
export class AuthenticationsModule {}
