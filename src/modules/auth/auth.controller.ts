import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { RequestWithUser } from './interfaces/request-with-user.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Public } from '../../common/decorators/public.decorator';
import { UserMapper } from '../users/mappers/user.mapper';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  @Public()
  @Post('register')
  async register(@Body(ValidationPipe) input: CreateUserDto) {
    return this.authService.register(input.username, input.email, input.password);
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const payload: any = this.jwtService.verify(token);
      await this.usersService.markEmailVerified(payload.sub);
      return { message: 'Email verified successfully!' };
    } catch (err) {
      return { message: 'Invalid or expired token' };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() input: LoginDto) {
    const user = await this.authService.validateUser(input.email, input.password);
    return this.authService.login(user);
  }

  @Get('check')
  async checkAuth(@Req() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.id)

    if (!user) {
      return {
        success: false,
        message: 'User not found',
        user: null,
      }
    }

    return {
      success: true,
      message: 'Authenticated',
      user: UserMapper.toResponse(user),
    }
  }
}
