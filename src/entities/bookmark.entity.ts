import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  link: string;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, user => user.bookmarks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Category, category => category.bookmarks)
  @JoinTable({
    name: 'bookmark_categories',
    joinColumn: {
      name: 'bookmark_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}