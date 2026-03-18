import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// 👇 Mock dependencies
const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  // =========================
  // 🔐 validateUser
  // =========================

  it('should return user if credentials are valid', async () => {
    const user = { email: 'test@test.com', password: 'hashed' };

    mockUsersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser('test@test.com', '1234');

    expect(result).toEqual(user);
  });

  it('should throw if user does not exist', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.validateUser('test@test.com', '1234'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password is incorrect', async () => {
    const user = { email: 'test@test.com', password: 'hashed' };

    mockUsersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.validateUser('test@test.com', 'wrong'),
    ).rejects.toThrow(UnauthorizedException);
  });

  // =========================
  // 🔑 login
  // =========================

  it('should return access token and user', () => {
    const user = { id: 1, email: 'test@test.com' };

    mockJwtService.sign.mockReturnValue('token');

    const result = service.login(user);

    expect(result.access_token).toBe('token');
    expect(result.user).toBeDefined();
  });

  // =========================
  // 📝 register
  // =========================

  it('should register a new user', async () => {
    const user = { id: 1, email: 'test@test.com' };

    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('token');
    mockMailService.sendVerificationEmail.mockResolvedValue('url');

    const result = await service.register(
      'test',
      'test@test.com',
      '1234',
    );

    expect(result.user).toBeDefined();
    expect(result.access_token).toBe('token');
    expect(result.verification_url).toBe('url');
  });

  it('should throw if user already exists', async () => {
    mockUsersService.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      service.register('test', 'test@test.com', '1234'),
    ).rejects.toThrow(ConflictException);
  });
});