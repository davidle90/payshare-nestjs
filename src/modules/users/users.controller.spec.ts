import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException, HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    findById: jest.fn(),
    findByUsername: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateUserById: jest.fn(),
    updateUserByUsername: jest.fn(),
    deleteUserById: jest.fn(),
    deleteUserByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  // =========================
  // GET
  // =========================

  it('should return all users', async () => {
    mockUsersService.getAllUsers.mockResolvedValue([]);

    const result = await controller.findAll();
    expect(result.data).toBeDefined();
  });

  it('should throw if user not found by id', async () => {
    mockUsersService.findById.mockResolvedValue(null);

    await expect(controller.findOneById('uuid')).rejects.toThrow(
      NotFoundException,
    );
  });

  // =========================
  // CREATE
  // =========================

  it('should create user', async () => {
    mockUsersService.findByUsername.mockResolvedValue(null);
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({ id: '1' });

    const result = await controller.create({
      username: 'test',
      email: 'test@test.com',
      password: '1234',
    });

    expect(result.data).toBeDefined();
  });

  it('should throw if username exists', async () => {
    mockUsersService.findByUsername.mockResolvedValue({});

    await expect(
      controller.create({
        username: 'test',
        email: 'test@test.com',
        password: '1234',
      }),
    ).rejects.toThrow(HttpException);
  });

  // =========================
  // UPDATE
  // =========================

  it('should update user by id', async () => {
    mockUsersService.updateUserById.mockResolvedValue({ id: '1' });

    const result = await controller.updateById('uuid', {});
    expect(result.data).toBeDefined();
  });

  it('should throw if update user not found', async () => {
    mockUsersService.updateUserById.mockResolvedValue(null);

    await expect(controller.updateById('uuid', {})).rejects.toThrow(
      NotFoundException,
    );
  });

  // =========================
  // DELETE
  // =========================

  it('should delete user by id', async () => {
    mockUsersService.deleteUserById.mockResolvedValue(true);

    const result = await controller.deleteById('uuid');
    expect(result.message).toBe('User deleted successfully');
  });

  it('should throw if delete fails', async () => {
    mockUsersService.deleteUserById.mockResolvedValue(false);

    await expect(controller.deleteById('uuid')).rejects.toThrow(
      NotFoundException,
    );
  });
});