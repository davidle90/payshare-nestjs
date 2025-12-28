import { Module } from '@nestjs/common';
import { ExpenseGroupsController } from './controllers/expense-groups.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { ExpenseService } from './services/expense.service';
import { ExpenseGroupService } from './services/expense-group.service';

@Module({
  providers: [ExpenseService, ExpenseGroupService],
  controllers: [ExpensesController, ExpenseGroupsController]
})
export class ExpenseSharingModule {}
