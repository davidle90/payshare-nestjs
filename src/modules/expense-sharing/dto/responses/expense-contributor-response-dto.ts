import { ExpenseGroupMemberResponseDto } from "./expense-group-member-response-dto";
import { ExpenseResponseDto } from "./expense-response-dto";
import { UserResponseDto } from "src/modules/users/dto/user-response-dto";

export class ExpenseContributorResponseDto {
  object: 'expense_contributor';
  id: string;
  expenseId: string;
  userId: string;

  memberId: string;
  amountPaid: number;

  createdAt: Date;
  updatedAt: Date;

  user?: UserResponseDto;
  member?: ExpenseGroupMemberResponseDto;
  expense?: ExpenseResponseDto;
}
