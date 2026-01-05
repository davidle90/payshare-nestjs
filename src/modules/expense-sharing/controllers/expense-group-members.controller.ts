import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { ExpenseGroupMemberMapper } from '../mappers/expense-group-member.mapper';
import { UpdateExpenseGroupMemberDto } from '../dto/requests/update-expense-group-member-dto';
import { CreateExpenseGroupMemberDto } from '../dto/requests/create-expense-group-member-dto';
import { ExpenseGroupService } from '../services/expense-group.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('expense-groups/:groupId/members')
@UseGuards(AuthGuard('jwt'))
export class ExpenseGroupMembersController {
    constructor(
        private readonly groupService: ExpenseGroupService,
        private readonly memberService: ExpenseGroupMemberService
    ) {}

    @Get()
    async findAll(@Param('groupId') groupId: string) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

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
        @User('userId') userId: string,
        @Param('groupId') groupId: string,
        @Param('memberId') memberId: string,
        @Body(ValidationPipe) input: UpdateExpenseGroupMemberDto,
    ) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isAdmin = await this.memberService.isAdmin(group, userId);
        if (!isAdmin) throw new HttpException('You do not have permission to update members in this group', HttpStatus.UNAUTHORIZED);

        const updatedMember = await this.memberService.updateMember(memberId, input);
        if (!updatedMember) throw new HttpException('Updated member not found', HttpStatus.NOT_FOUND);

        return { data: ExpenseGroupMemberMapper.toResponse(updatedMember) };
    }

    @Delete(':memberId')
    async removeMember(@User('userId') userId: string, @Param('groupId') groupId: string, @Param('memberId') memberId: string) {
        const group = await this.groupService.findOne(groupId);
        if (!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND);

        const isMember = await this.memberService.isMember(group, userId);
        if (!isMember) throw new HttpException('You do not have permission to remove members from this group', HttpStatus.UNAUTHORIZED);

        await this.memberService.removeMember(group.id, memberId);
    }
}
