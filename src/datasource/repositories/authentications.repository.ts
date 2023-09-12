import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Authentication } from '../entities';

@Injectable()
export class AuthenticationsRepository {
  authDatasource: Repository<Authentication>;
  constructor(
    @InjectEntityManager() private readonly datasource: EntityManager,
  ) {
    this.authDatasource = datasource.getRepository(Authentication);
  }

  async insertNewAuth(auth: Authentication): Promise<string> {
    const addedAuth = await this.authDatasource.save(auth);

    return addedAuth.id;
  }

  async deleteAuth(id: string): Promise<void> {
    await this.authDatasource.delete({
      id,
    });
  }

  async getAuth(authId: string, userId: string): Promise<Authentication> {
    return this.authDatasource.findOneBy({
      id: authId,
      user: { id: userId },
    });
  }
}
