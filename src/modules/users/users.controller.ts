import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { SwaggerGetAllUsers } from './decorators/swagger.decorators';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @SwaggerGetAllUsers()
  async getUsers() {
    const users = this.usersService.getAllUsers();
    return users;
  }
}
