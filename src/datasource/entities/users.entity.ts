import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Authentication } from './authentications.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'fullname', type: 'varchar', length: 50 })
  fullname: string;

  @Column({ name: 'password', type: 'text' })
  password: string;

  @OneToMany(() => Authentication, (auth) => auth.user)
  authentications: Authentication[];
}
