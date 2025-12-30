import { UserResponseDto } from "src/modules/users/dto/user-response-dto";
import { ExpenseGroupReferenceDto } from "../references/expense-group-reference-dto";

export class ExpenseGroupMemberResponseDto {
  object: 'expense_group_member';
  id: string;
  role: string;
  group?: ExpenseGroupReferenceDto | string | null;
  user: UserResponseDto | null;
  createdAt: Date;
  updatedAt: Date;
}
