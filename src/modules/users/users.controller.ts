import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers() {
    // return this.usersService.dummmyUsers;
  }

  @Post('/create')
  createRecord(@Body() body: { transactionId: string; utr: string }) {
    return this.usersService.createUser(body.transactionId, body.utr);
  }
}
