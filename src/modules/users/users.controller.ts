import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserMapper } from './mappers/user.mapper';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.getAllUsers();
    return { data: UserMapper.toResponseList(users)};
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return { data: UserMapper.toResponse(user)};
  }
}
