import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Note } from './notes.entity';
import { User } from './users.entity';

@Entity()
export class Directory {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column()
  title: string;

  @Column({ name: 'parent_id', default: null })
  parentId: string;

  @ManyToOne(() => Directory, (p) => p.children)
  parent?: Directory;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Directory, (c) => c.parent)
  children: Directory[];

  @OneToMany(() => Note, (n) => n.directory)
  notes: Note[];
}
