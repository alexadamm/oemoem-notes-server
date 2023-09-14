import { JwtPayload } from 'jsonwebtoken';

export class JwtPayloadDTO implements JwtPayload {
  username: string;
  sub: string;
  aud: string;
  iss: string;
  jti?: string;
  exp: number;
  iat: number;
}
