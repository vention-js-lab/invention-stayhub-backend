import { UserService } from './users.service';
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create() {
    return this.userService.create();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get()
  findOne() {
    return this.userService.findOne();
  }

  @Put()
  update() {
    return this.userService.update();
  }

  @Delete()
  remove() {
    return this.userService.remove();
  }
}
