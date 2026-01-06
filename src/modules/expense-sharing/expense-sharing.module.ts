import { Module } from '@nestjs/common';
import { ExpenseGroupsController } from './controllers/expense-groups.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { ExpenseService } from './services/expense.service';
import { ExpenseGroupService } from './services/expense-group.service';
import { ExpenseGroupMemberService } from './services/expense-group-member.service';
import { ExpenseGroupMembersController } from './controllers/expense-group-members.controller';
import { ExpenseParticipantService } from './services/expense-participant.service';
import { ExpenseContributorService } from './services/expense-contributor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseContributor } from './entities/expense-contributor.entity';
import { ExpenseDebt } from './entities/expense-debt.entity';
import { ExpenseGroupMember } from './entities/expense-group-member.entity';
import { ExpenseGroup } from './entities/expense-group.entity';
import { ExpenseParticipant } from './entities/expense-participant.entity';
import { Expense } from './entities/expense.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ExpenseParticipantsController } from './controllers/expense-participants.controller';
import { ExpenseContributorsController } from './controllers/expense-contributors.controller';
import { ExpenseListener } from './listeners/expense.listener';
import { ExpenseDebtService } from './services/expense-debt.service';
import { ExpenseDebtsController } from './controllers/expense-debts.controller';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      User,
      Expense,
      ExpenseGroup,
      ExpenseGroupMember,
      ExpenseDebt,
      ExpenseParticipant,
      ExpenseContributor,
    ]),
  ],
  providers: [
    ExpenseService,
    ExpenseGroupService,
    ExpenseGroupMemberService,
    ExpenseParticipantService,
    ExpenseContributorService,
    ExpenseDebtService,
    ExpenseListener,
  ],
  controllers: [
    ExpensesController,
    ExpenseGroupsController,
    ExpenseGroupMembersController,
    ExpenseParticipantsController,
    ExpenseContributorsController,
    ExpenseDebtsController,
  ],
})
export class ExpenseSharingModule {}
