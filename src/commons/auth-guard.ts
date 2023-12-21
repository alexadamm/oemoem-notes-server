import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/datasource/repositories/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers?.authorization;

    if (!key) throw new UnauthorizedException('No key provided');

    const userData = await this.usersRepository.getUserByKey(key);

    if (!userData) throw new UnauthorizedException('Invalid key');

    request.userId = userData.id;

    return true;
  }
}
