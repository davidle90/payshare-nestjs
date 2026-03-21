import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UserMapper } from '../users/mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  /**
  * Validates a user by email and password.
  *
  * @param email - The user's email.
  * @param password - The user's plaintext password.
  * @returns The user object if credentials are valid.
  * @throws UnauthorizedException if the user does not exist or password is wrong.
  */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /**
  * Logs in a user and returns an access token.
  *
  * @param user - The authenticated user object
  * @returns An object containing JWT access token and mapped user response
  */
  login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload), user: UserMapper.toResponse(user) };
  }

  /**
  * Registers a new user and sends a verification email.
  *
  * @param username - The user's username
  * @param email - The user's email
  * @param password - The user's plaintext password
  * @returns Object containing user data, verification URL, and access token
  *
  * @throws ConflictException if a user with the email already exists
  */
  async register(username: string, email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.create(username, email, password);

    const verificationToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '1d' },
    );

    const url = await this.mailService.sendVerificationEmail(user.email, verificationToken);
    const payload = { sub: user.id, email: user.email }

    return { user: UserMapper.toResponse(user), verification_url: url, access_token: this.jwtService.sign(payload) };
  }
}
