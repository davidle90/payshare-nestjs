import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ExpenseGroupService } from "../services/expense-group.service";
import { EXPENSE_CHANGED_EVENT } from "../events/expense.events";
import { ExpenseService } from "../services/expense.service";

@Injectable()
export class ExpenseListener {
  constructor(
    private readonly groupService: ExpenseGroupService,
    private readonly expenseService: ExpenseService,
) {}

  @OnEvent(EXPENSE_CHANGED_EVENT)
  async handleExpenseChanged(payload: { expenseId?: string; groupId?: string }) {
      let groupId: string | undefined;

      if (payload.expenseId) {
          const expense = await this.expenseService.updateTotalAmount(payload.expenseId);
          groupId = expense?.groupId;
      }

      if (!groupId && payload.groupId) {
          groupId = payload.groupId;
      }

      if (groupId) {
          await this.groupService.updateTotalExpenses(groupId);
      }
  }
}
