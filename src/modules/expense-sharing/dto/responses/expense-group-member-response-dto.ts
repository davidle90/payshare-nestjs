import { UserResponseDto } from "src/modules/users/dto/user-response-dto";
import { ExpenseGroupResponseDto } from "./expense-group-response-dto";

export class ExpenseGroupMemberResponseDto {
  id: string;
  role: string;
  group: ExpenseGroupResponseDto;
  user: UserResponseDto | null;
  createdAt: Date;
  updatedAt: Date;
}
