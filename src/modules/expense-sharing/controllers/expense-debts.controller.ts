import { Controller, UseGuards, Get, Param, HttpException, HttpStatus, ForbiddenException, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExpenseDebtMapper } from "../mappers/expense-debt.mapper";
import { ExpenseDebtService } from "../services/expense-debt.service";
import { ExpenseGroupService, Transaction } from "../services/expense-group.service";
import { ExpenseGroupPolicy } from "../policies/expense-group.policy";

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ExpenseDebtsController {
    constructor(
        private readonly groupService: ExpenseGroupService,
        private readonly debtService: ExpenseDebtService,
        private readonly expenseGroupPolicy: ExpenseGroupPolicy,
    ) {}

    @Get('expense-groups/:groupId/balance/calculate')
    async calculateBalance(@Req() req, @Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        if (!this.expenseGroupPolicy.isMember(req.user, group)) {
            throw new ForbiddenException();
        }

        const balance = await this.groupService.calculateBalance(group.id);

        return { data: balance }
    }

    @Get('expense-groups/:groupId/balance/simplify')
    async simplifyBalance(@Req() req, @Param('groupId') groupId: string): Promise<{ data: Transaction[] }> {
        const group = await this.groupService.findOne(groupId);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, group)) {
            throw new ForbiddenException();
        }

        const balance = await this.groupService.simplifyBalance(group.id);

        return { data: balance }
    }

    @Get('expense-groups/:groupId/balance/debts')
    async findDebtsByGroup(@Req() req, @Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
        
        if (!this.expenseGroupPolicy.isMember(req.user, group)) {
            throw new ForbiddenException();
        }

        const debts = await this.debtService.findByGroupId(group.id);

        return {
            data: ExpenseDebtMapper.toResponseList(debts),
            meta: {
                count: debts.length
            }
        }
    }

    @Get('expense-debts/by-userid/:fromUserId')
    async findDebtsByFromUserId(@Param('fromUserId') fromUserId: string) {
        const debts = await this.debtService.findByUserId(fromUserId);
        return {
            data: ExpenseDebtMapper.toResponseList(debts),
            meta: {
                count: debts.length
            }
        }
    }

    @Get('expense-groups/:groupId/balance/settleup')
    async settleUpByGroup(@Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        await this.debtService.settleUpByGroupId(group.id);

        return { success: true, message: 'Settle up successful' }
    }
}
