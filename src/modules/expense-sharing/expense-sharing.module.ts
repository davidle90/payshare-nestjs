import { Module } from '@nestjs/common';
import { ExpenseGroupsController } from './controllers/expense-groups.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { ExpenseService } from './services/expense.service';
import { ExpenseGroupService } from './services/expense-group.service';
import { ExpenseGroupMemberService } from './services/expense-group-member.service';
import { ExpenseGroupMembersController } from './controllers/expense-group-members.controller';
import { ExpenseParticipantService } from './services/expense-participant.service';
import { ExpenseContributorService } from './services/expense-contributor.service';

@Module({
  providers: [ExpenseService, ExpenseGroupService, ExpenseGroupMemberService, ExpenseParticipantService, ExpenseContributorService],
  controllers: [ExpensesController, ExpenseGroupsController, ExpenseGroupMembersController]
})
export class ExpenseSharingModule {}
