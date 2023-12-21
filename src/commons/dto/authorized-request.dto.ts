import { Request } from 'express';

export class AuthorizedRequestDTO extends Request {
  userId: string;
}
