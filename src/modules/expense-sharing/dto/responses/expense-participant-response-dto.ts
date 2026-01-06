import { ExpenseGroupMemberResponseDto } from "./expense-group-member-response-dto";
import { ExpenseResponseDto } from "./expense-response-dto";
import { UserResponseDto } from "src/modules/users/dto/user-response-dto";

export class ExpenseParticipantResponseDto {
  object: 'expense_participant';
  id: string;
  expenseId: string;
  userId: string;

  memberId: string;
  amountOwed: number;

  createdAt: Date;
  updatedAt: Date;

  user?: UserResponseDto | null;
  member?: ExpenseGroupMemberResponseDto;
  expense?: ExpenseResponseDto;
}
