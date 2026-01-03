import { ExpenseGroupMemberResponseDto } from "./expense-group-member-response-dto";

export class ExpenseGroupResponseDto {
  object: 'expense_group';
  id: string;
  referenceId: string;
  name: string;

  currency: string;
  totalExpenses: number;
  status: string;

  createdAt: Date;
  updatedAt: Date;

  members?: ExpenseGroupMemberResponseDto[];

  expenses?: any[];
  debts?: any[];
}
