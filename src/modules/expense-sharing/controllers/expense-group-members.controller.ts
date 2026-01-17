import { Body, Controller, Delete, ForbiddenException, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { ExpenseGroupMemberMapper } from '../mappers/expense-group-member.mapper';
import { UpdateExpenseGroupMemberDto } from '../dto/requests/update-expense-group-member-dto';
import { CreateExpenseGroupMemberDto } from '../dto/requests/create-expense-group-member-dto';
import { ExpenseGroupService } from '../services/expense-group.service';
import { ExpenseGroupPolicy } from '../policies/expense-group.policy';

@Controller('expense-groups/:groupId/members')
@UseGuards(AuthGuard('jwt'))
export class ExpenseGroupMembersController {
    constructor(
        private readonly groupService: ExpenseGroupService,
        private readonly memberService: ExpenseGroupMemberService,
        private readonly expenseGroupPolicy: ExpenseGroupPolicy,
    ) {}

    @Get()
    async findAll(@Req() req, @Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isMember(req.user, group)) {
            throw new ForbiddenException();
        }

        const members = await this.memberService.findAll(group.id);

        return {
            data: ExpenseGroupMemberMapper.toResponseList(members),
            meta: {
                count: members.length
            }
        };
    }

    @Post()
    async addMember(@Param('groupId') groupId: string, @Body() input: CreateExpenseGroupMemberDto) {
        const member = await this.memberService.addMember(groupId, input.userId, input.role);
        return { data: ExpenseGroupMemberMapper.toResponse(member)};
    }

    @Patch(':memberId')
    async updateMember(
        @Req() req,
        @Param('groupId') groupId: string,
        @Param('memberId') memberId: string,
        @Body(ValidationPipe) input: UpdateExpenseGroupMemberDto,
    ) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isAdmin(req.user, group)) {
            throw new ForbiddenException();
        }

        const updatedMember = await this.memberService.updateMember(memberId, input);
        if (!updatedMember) throw new HttpException('Updated member not found', HttpStatus.NOT_FOUND);

        return { data: ExpenseGroupMemberMapper.toResponse(updatedMember) };
    }

    @Delete(':memberId')
    async removeMember(@Req() req, @Param('groupId') groupId: string, @Param('memberId') memberId: string) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        if (!this.expenseGroupPolicy.isAdmin(req.user, group)) {
            throw new ForbiddenException();
        }

        await this.memberService.removeMember(group.id, memberId);
    }
}
