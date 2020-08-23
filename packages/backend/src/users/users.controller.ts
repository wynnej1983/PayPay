import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../role/guards/role.guard';
import { Roles } from '../role/decorators/role.decorator';
import { RolesData } from '../role/data/role.data';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(RolesData.Admin)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @Roles(RolesData.Admin)
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  @Get(':id')
  @Roles(RolesData.Admin)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get()
  @Roles(RolesData.Admin)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
