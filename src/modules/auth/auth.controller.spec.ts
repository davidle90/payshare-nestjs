import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from '../users/mappers/user.mapper';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockUsersService = {
    markEmailVerified: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  // =========================
  // register
  // =========================

  it('should call register on AuthService', async () => {
    mockAuthService.register.mockResolvedValue({});

    await controller.register({
      username: 'test',
      email: 'test@test.com',
      password: '1234',
    });

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'test',
      'test@test.com',
      '1234',
    );
  });

  // =========================
  // login
  // =========================

  it('should validate user and return login result', async () => {
    const user = { id: 1, email: 'test@test.com' };

    mockAuthService.validateUser.mockResolvedValue(user);
    mockAuthService.login.mockReturnValue({ access_token: 'token' });

    const result = await controller.login({
      email: 'test@test.com',
      password: '1234',
    });

    expect(mockAuthService.validateUser).toHaveBeenCalledWith(
      'test@test.com',
      '1234',
    );
    expect(mockAuthService.login).toHaveBeenCalledWith(user);
    expect(result).toEqual({ access_token: 'token' });
  });

  // =========================
  // verifyEmail
  // =========================

  it('should verify email successfully', async () => {
    mockJwtService.verify.mockReturnValue({ sub: 1 });

    const result = await controller.verifyEmail('token');

    expect(mockJwtService.verify).toHaveBeenCalledWith('token');
    expect(mockUsersService.markEmailVerified).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: 'Email verified successfully!' });
  });

  it('should return error if token is invalid', async () => {
    mockJwtService.verify.mockImplementation(() => {
      throw new Error();
    });

    const result = await controller.verifyEmail('invalid');

    expect(result).toEqual({ message: 'Invalid or expired token' });
  });

  // =========================
  // checkAuth
  // =========================

  it('should return authenticated user', async () => {
    const user = { id: 1, email: 'test@test.com' };

    mockUsersService.findById.mockResolvedValue(user);
    jest.spyOn(UserMapper, 'toResponse').mockReturnValue({ id: 1 });

    const result = await controller.checkAuth({
      user: { id: 1 },
    } as any);

    expect(result).toEqual({
      success: true,
      message: 'Authenticated',
      user: { id: 1 },
    });
  });

  it('should return not found if user does not exist', async () => {
    mockUsersService.findById.mockResolvedValue(null);

    const result = await controller.checkAuth({
      user: { id: 1 },
    } as any);

    expect(result).toEqual({
      success: false,
      message: 'User not found',
      user: null,
    });
  });
});