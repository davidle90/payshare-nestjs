import { UserResponseDto } from 'src/modules/users/dto/user-response-dto';

export interface RequestWithUser extends Request {
  user: UserResponseDto;
}
