export class ExpenseGroupResponseDto {
  id: string;
  referenceId: string;
  name: string;

  totalExpenses: number;

  status: string;

  createdAt: Date;
  updatedAt: Date;

  members?: any[];
  expenses?: any[];
  debts?: any[];
}
