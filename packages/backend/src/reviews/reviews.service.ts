import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  findAll() {
    return this.reviewsRepository.find();
  }

  async findById(id: string) {
    const review = await this.reviewsRepository.findOne(id);
    if (review) {
      return review;
    }
    throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
  }

  async findByAssigned(userId: string) {
    const reviews = await this.reviewsRepository.find();
    return reviews.filter((review) =>
      review.reviewers.map((user) => user.id).includes(userId),
    );
  }

  async update(id: number, review: UpdateReviewDto) {
    await this.reviewsRepository.update(id, review);
    const updatedReview = await this.reviewsRepository.findOne(id);
    if (updatedReview) {
      return updatedReview;
    }
    throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
  }

  async create(review: CreateReviewDto) {
    const reviewToSave = this.reviewsRepository.create(review);
    const newReview = await this.reviewsRepository.save(reviewToSave);

    const reviewee = await this.usersRepository.findOne({
      where: { id: review.revieweeId },
      relations: ['reviews'],
    });
    reviewee.reviews.push(newReview);
    await this.usersRepository.save(reviewee);

    return newReview;
  }

  async assignReviewer(id: string, reviewerId: string) {
    const review = await this.reviewsRepository.findOne(id);
    const reviewer = await this.usersRepository.findOne({ id: reviewerId });

    if (!review) {
      throw new HttpException('Review not found', HttpStatus.BAD_REQUEST);
    }

    if (!reviewer) {
      throw new HttpException('Reviewer not found', HttpStatus.BAD_REQUEST);
    }

    if (review.reviewers.some((r) => r.id === reviewerId)) {
      console.log(review);
      throw new HttpException(
        'Cannot assign the same reviewer more than once',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (reviewerId === review.reviewee.id) {
      throw new HttpException(
        'Cannot assign the reviewee as a reviewer',
        HttpStatus.BAD_REQUEST,
      );
    }
    review.reviewers.push(reviewer);
    await this.reviewsRepository.save(review);
    // reviewer.reviews.push(review);
    // await this.usersRepository.save(reviewer);

    return review;
  }

  async addComment(id: string, createComment: CreateCommentDto) {
    let review = await this.reviewsRepository.findOne({ id });

    const comment = this.commentRepository.create(createComment);
    review.comments.push(comment);

    await this.commentRepository.save(comment);
    review = await this.reviewsRepository.save(review);

    return review;
  }

  async delete(id: string) {
    const deletedResponse = await this.reviewsRepository.delete(id);
    if (!deletedResponse) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
  }
}
