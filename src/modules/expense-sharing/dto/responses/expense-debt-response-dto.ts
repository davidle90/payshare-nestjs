import { UserResponseDto } from "src/modules/users/dto/user-response-dto";

export class ExpenseDebtResponseDto {
  object: 'expense_debt';
  id: string;
  groupId: string;
  isSettled: boolean;
  fromUser: UserResponseDto | string;
  toUser: UserResponseDto | string;
  amount: number;
}
