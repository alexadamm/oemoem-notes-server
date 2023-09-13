import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SECRET,
} from '../helpers/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    let token = request.headers?.authorization;

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      jwt.verify(token, JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
      });
    } catch (e) {
      if (e.name === 'TokenExpiredError')
        throw new UnauthorizedException('Token is expired');
      throw new UnauthorizedException('Invalid token');
    }

    const userData = jwt.decode(token);
    request.user = userData;

    return true;
  }
}
