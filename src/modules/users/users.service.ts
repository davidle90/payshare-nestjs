import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ username, email, password: hashed });
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async updateUserById(id: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return null;

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updateUserByUsername(username: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) return null;

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async deleteUserByUsername(username: string) {
    const result = await this.usersRepository.delete({ username });
    return (result.affected ?? 0) > 0;
  }

  async markEmailVerified(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = true;
    return this.usersRepository.save(user);
  }
}
