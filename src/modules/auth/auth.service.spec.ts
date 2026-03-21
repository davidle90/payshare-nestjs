import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserMapper } from '../users/mappers/user.mapper';
import * as bcrypt from 'bcrypt';

// Mock dependencies
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
    jest.clearAllMocks();
  });

  // =========================
  // validateUser
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

  it('should call findByEmail and bcrypt.compare with correct values', async () => {
    const user = { email: 'test@test.com', password: 'hashed' };

    mockUsersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await service.validateUser('test@test.com', '1234');

    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@test.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('1234', user.password);
  });

  // =========================
  // login
  // =========================

  it('should return access token and user', () => {
    const user = { id: 1, email: 'test@test.com' };

    mockJwtService.sign.mockReturnValue('token');
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    const result = service.login(user);

    expect(result).toEqual({
      access_token: 'token',
      user: { id: 1 },
    });
  });

  it('should call jwtService.sign with correct payload', () => {
    const user = { id: 1, email: 'test@test.com' };

    mockJwtService.sign.mockReturnValue('token');
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    service.login(user);

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'test@test.com',
    });
  });

  it('should call UserMapper.toResponse with user', () => {
    const user = { id: 1, email: 'test@test.com' };

    mockJwtService.sign.mockReturnValue('token');
    const spy = jest
      .spyOn(UserMapper, 'toResponse')
      .mockReturnValue({ id: 1 });

    service.login(user);

    expect(spy).toHaveBeenCalledWith(user);
  });

  // =========================
  // register
  // =========================

  it('should register a new user', async () => {
    const user = { id: 1, email: 'test@test.com' };

    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('token');
    mockMailService.sendVerificationEmail.mockResolvedValue('url');
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    const result = await service.register(
      'test',
      'test@test.com',
      '1234',
    );

    expect(result).toEqual({
      user: { id: 1 },
      verification_url: 'url',
      access_token: 'token',
    });
  });

  it('should throw if user already exists', async () => {
    mockUsersService.findByEmail.mockResolvedValue({ id: 1 });

    await expect(
      service.register('test', 'test@test.com', '1234'),
    ).rejects.toThrow(ConflictException);
  });

  it('should call create with correct arguments', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({ id: 1, email: 'test@test.com' });
    mockJwtService.sign.mockReturnValue('token');
    mockMailService.sendVerificationEmail.mockResolvedValue('url');
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    await service.register('test', 'test@test.com', '1234');

    expect(mockUsersService.create).toHaveBeenCalledWith(
      'test',
      'test@test.com',
      '1234',
    );
  });

  it('should call jwtService.sign twice', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({ id: 1, email: 'test@test.com' });
    mockJwtService.sign.mockReturnValue('token');
    mockMailService.sendVerificationEmail.mockResolvedValue('url');
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    await service.register('test', 'test@test.com', '1234');

    expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('should send verification email with correct data', async () => {
    const user = { id: 1, email: 'test@test.com' };

    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('verification-token');
    mockMailService.sendVerificationEmail.mockResolvedValue('url');
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    await service.register('test', 'test@test.com', '1234');

    expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
      user.email,
      'verification-token',
    );
  });

  it('should throw if email sending fails', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({ id: 1, email: 'test@test.com' });
    mockJwtService.sign.mockReturnValue('token');
    mockMailService.sendVerificationEmail.mockRejectedValue(new Error());

    await expect(
      service.register('test', 'test@test.com', '1234'),
    ).rejects.toThrow();
  });
});