import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  const mockRepo = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  // =========================
  // create
  // =========================

  it('should create user with hashed password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    repo.create.mockReturnValue({} as User);
    repo.save.mockResolvedValue({ id: '1' } as User);

    const result = await service.create('test', 'test@test.com', '1234');

    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe('1');
  });

  // =========================
  // find
  // =========================

  it('should return user by email', async () => {
    const user = { email: 'test@test.com' };
    repo.findOneBy.mockResolvedValue(user as User);

    const result = await service.findByEmail('test@test.com');
    expect(result).toEqual(user);
  });

  // =========================
  // update
  // =========================

  it('should update user and hash password', async () => {
    const user = { id: '1' };
    repo.findOneBy.mockResolvedValue(user as User);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    repo.save.mockResolvedValue({ ...user, password: 'hashed' } as User);

    const result = await service.updateUserById('1', { password: '1234' });

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result?.password).toBe('hashed');
  });

  it('should return null if user not found on update', async () => {
    repo.findOneBy.mockResolvedValue(null);

    const result = await service.updateUserById('1', {});
    expect(result).toBeNull();
  });

  // =========================
  // delete
  // =========================

  it('should delete user by id', async () => {
    repo.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await service.deleteUserById('1');
    expect(result).toBe(true);
  });

  it('should return false if delete fails', async () => {
    repo.delete.mockResolvedValue({ affected: 0 } as any);

    const result = await service.deleteUserById('1');
    expect(result).toBe(false);
  });

  // =========================
  // markEmailVerified
  // =========================

  it('should mark user as verified', async () => {
    const user = { id: '1', isVerified: false };
    repo.findOneBy.mockResolvedValue(user as User);
    repo.save.mockResolvedValue({ ...user, isVerified: true } as User);

    const result = await service.markEmailVerified('1');

    expect(result.isVerified).toBe(true);
  });

  it('should throw if user not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.markEmailVerified('1')).rejects.toThrow(
      NotFoundException,
    );
  });
});