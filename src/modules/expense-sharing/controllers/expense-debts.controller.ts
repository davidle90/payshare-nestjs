import { Controller, UseGuards, Get, Param, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/common/decorators/user.decorator";
import { ExpenseDebtMapper } from "../mappers/expense-debt.mapper";
import { ExpenseDebtService } from "../services/expense-debt.service";
import { ExpenseGroupMemberService } from "../services/expense-group-member.service";
import { ExpenseGroupService, Transaction } from "../services/expense-group.service";

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ExpenseDebtsController {
    constructor(
        private readonly groupService: ExpenseGroupService,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly debtService: ExpenseDebtService,
    ) {}

    @Get('expense-groups/:groupId/balance/calculate')
    async calculateBalance(@User('userId') userId: string, @Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(group, userId);
        if (!isMember) throw new HttpException('You do not have permission to delete this group', HttpStatus.UNAUTHORIZED);

        const balance = await this.groupService.calculateBalance(group.id);

        return { data: balance }
    }

    @Get('expense-groups/:groupId/balance/simplify')
    async simplifyBalance(@User('userId') userId: string, @Param('groupId') groupId: string): Promise<{ data: Transaction[] }> {
        const group = await this.groupService.findOne(groupId);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isMember = await this.memberService.isMember(group, userId);
        if (!isMember) throw new HttpException('You do not have permission to delete this group', HttpStatus.UNAUTHORIZED);

        const balance = await this.groupService.simplifyBalance(group.id);

        return { data: balance }
    }

    @Get('expense-groups/:groupId/balance/debts')
    async findDebtsByGroup(@User('userId') userId: string, @Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
        
        const isMember = await this.memberService.isMember(group, userId);
        if (!isMember) throw new HttpException('You do not have permission to delete this group', HttpStatus.UNAUTHORIZED);

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
}
