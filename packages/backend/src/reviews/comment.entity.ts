import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  body: string;

  @ManyToOne(() => Review, (review) => review.comments)
  review: Review;
}
