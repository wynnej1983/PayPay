import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../role/guards/role.guard';
import { Roles } from '../role/decorators/role.decorator';
import { RolesData } from '../role/data/role.data';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reviewsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assigned/:reviewerId')
  findByAssigned(@Param('reviewerId') reviewerId: string) {
    return this.reviewsService.findByAssigned(reviewerId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesData.Admin)
  @Post()
  async create(@Body() review: CreateReviewDto) {
    return this.reviewsService.create(review);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesData.Admin)
  @Post(':id/reviewers')
  async assignReviewer(
    @Param('id') id,
    @Body('reviewerId') reviewerId: string,
  ) {
    return this.reviewsService.assignReviewer(id, reviewerId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(@Param('id') id, @Body() comment: CreateCommentDto) {
    return this.reviewsService.addComment(id, comment);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesData.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() review: UpdateReviewDto) {
    return this.reviewsService.update(Number(id), review);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(RolesData.Admin)
  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   this.reviewsService.delete(id);
  // }
}
