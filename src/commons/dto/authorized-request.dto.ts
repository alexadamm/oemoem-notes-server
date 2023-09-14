import { Request } from 'express';
import { JwtPayloadDTO } from './jwt-payload.dto';

export class AuthorizedRequestDTO extends Request {
  user: JwtPayloadDTO;
}
