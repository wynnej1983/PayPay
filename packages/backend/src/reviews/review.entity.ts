import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  reviewee: User;

  @OneToMany(() => User, (user) => user.review, { eager: true })
  reviewers: User[];

  @OneToMany(() => Comment, (comment) => comment.review, { eager: true })
  comments: Comment[];
}
