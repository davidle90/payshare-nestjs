import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';

/**
 * Handles user-related business logic such as creation,
 * retrieval, updates, deletion, and email verification.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  /**
   * Retrieves all users.
   */
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Creates a new user with hashed password.
   */
  async create(username: string, email: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, email, password: hashed });
    return this.usersRepository.save(user);
  }

  /**
   * Finds a user by username.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  /**
   * Finds a user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  /**
   * Finds a user by ID.
   */
  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Updates a user by ID.
   * Hashes password if provided.
   */
  async updateUserById(id: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return null;

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  /**
   * Updates a user by username.
   */
  async updateUserByUsername(username: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) return null;

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  /**
   * Deletes a user by ID.
   * Returns true if deleted.
   */
  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Deletes a user by username.
   */
  async deleteUserByUsername(username: string) {
    const result = await this.usersRepository.delete({ username });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Marks a user's email as verified.
   */
  async markEmailVerified(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = true;
    return this.usersRepository.save(user);
  }
}
