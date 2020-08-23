import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

import { Role } from '../role/role.entity';
import { Review } from '../reviews/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @OneToMany(() => Review, (review) => review.reviewee, { onDelete: 'CASCADE' })
  reviews: Review[];

  @ManyToOne(() => Review, (review) => review.reviewers, {
    onDelete: 'CASCADE',
  })
  review: Review;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @BeforeInsert()
  async passwordToHash() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
