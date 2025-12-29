import { UserResponseDto } from "src/modules/users/dto/user-response-dto";

export class ExpenseGroupMemberResponseDto {
  id: string;
  role: string;
  user: UserResponseDto | null;
  createdAt: Date;
  updatedAt: Date;
}
