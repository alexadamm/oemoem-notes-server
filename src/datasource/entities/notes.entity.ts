import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Directory } from './directories.entity';
import { User } from './users.entity';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 50 })
  title: string;

  @Column({ name: 'body', type: 'varchar' })
  body: string;

  @Column({ name: 'direcory_id', default: 0 })
  directoryId: string;

  @ManyToOne(() => Directory, (d) => d.notes)
  directory: Directory;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  constructor(title?: string, body?: string) {
    this.title = title;
    this.body = body;
  }
}
