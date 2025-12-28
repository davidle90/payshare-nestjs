import { UserResponseDto } from '../dto/user-response-dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map(this.toResponse);
  }
}
