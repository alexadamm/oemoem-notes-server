import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '.';

@Entity({ name: 'authentications' })
export class Authentication {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @ManyToOne(() => User, (user) => user.authentications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
