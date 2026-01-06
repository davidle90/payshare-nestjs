import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserMapper } from './mappers/user.mapper';
import { UpdateUserDto } from './dto/update-user-dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.getAllUsers();
    return { data: UserMapper.toResponseList(users) };
  }

  @Get(':id')
  async findOneById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findById(id);
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { data: UserMapper.toResponse(user) };
  }

  @Get('/by-username/:username')
  async findOneByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { data: UserMapper.toResponse(user) };
  }

  @Post()
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;

    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const existingEmail = await this.usersService.findByEmail(email);
    if (existingEmail) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const user = await this.usersService.create(username, email, password);

    return { data: UserMapper.toResponse(user) };
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUserById(id, updateUserDto);
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { data: UserMapper.toResponse(user) };
  }

  @Patch('/by-username/:username')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateByUsername(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUserByUsername(
      username,
      updateUserDto,
    );
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { data: UserMapper.toResponse(user) };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = await this.usersService.deleteUserById(id);
    if (!deleted)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { message: 'User deleted successfully' };
  }

  @Delete('/by-username/:username')
  @UseGuards(AdminGuard)
  async deleteByUsername(@Param('username') username: string) {
    const deleted = await this.usersService.deleteUserByUsername(username);
    if (!deleted)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return { message: 'User deleted successfully' };
  }
}
