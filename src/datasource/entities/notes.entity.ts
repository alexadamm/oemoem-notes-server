import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 50 })
  title: string;

  @Column({ name: 'body', type: 'varchar' })
  body: string;

  @Column({ name: 'tags', type: 'json' })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(title?: string, body?: string, tags?: string[]) {
    this.title = title;
    this.body = body;
    this.tags = tags;
  }
}
