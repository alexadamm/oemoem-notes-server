import * as argon2 from 'argon2';
export class PasswordHasher {
  private static salt = Buffer.from('SECRET_SALT', 'utf8');

  static async hashPassword(plainPassword: string): Promise<string> {
    const hashedPassword = await argon2.hash(plainPassword, {
      salt: this.salt,
    });
    return hashedPassword;
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword, {
      salt: this.salt,
    });
  }
}
