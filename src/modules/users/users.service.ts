import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Account) private userRepo: Account) {}

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne() {
    return `This action returns user`;
  }

  update() {
    return `This action updates user`;
  }

  remove() {
    return `This action removes user`;
  }
}
