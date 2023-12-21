import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './notes.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'fullname', type: 'varchar', length: 50 })
  fullname: string;

  @Column({ name: 'key', type: 'text' })
  key: string;

  @OneToMany(() => Note, (notes) => notes.owner)
  notes: string[];
}
