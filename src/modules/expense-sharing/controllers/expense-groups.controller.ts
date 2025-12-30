import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExpenseGroupService, Transaction } from '../services/expense-group.service';
import { CreateExpenseGroupDto } from '../dto/requests/create-expense-group-dto';
import { UpdateExpenseGroupDto } from '../dto/requests/update-expense-group-dto';
import { ExpenseGroupMapper } from '../mappers/expense-group.mapper';
import { ExpenseGroupMemberService } from '../services/expense-group-member.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { UsersService } from 'src/modules/users/users.service';

@Controller('expense-groups')
@UseGuards(AuthGuard('jwt'))
export class ExpenseGroupsController {
    constructor(
        private groupService: ExpenseGroupService,
        private memberService: ExpenseGroupMemberService,
        private userService: UsersService,
    ) {}

    @Get()
    async findAll(@User('userId') userId: string, @Query('search') search?: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const groups = await this.groupService.findAll({ userId, search, includes: includesArray });

        //todo: add permission to get all;

        return {
            data: ExpenseGroupMapper.toResponseList(groups, includesArray),
            meta: {
                count: groups.length
            }
        };
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Query('includes') includes?: string) {
        const includesArray = includes ? includes.split(',') : [];
        const group = await this.groupService.findOne(id, includesArray);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        return {
            data: ExpenseGroupMapper.toResponse(group, includesArray),
        };
    }

    @Post()
    async create(
        @Body(ValidationPipe) input: CreateExpenseGroupDto,
        @User('userId') userId: string
    ) {
        const user = await this.userService.findById(userId);
        if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        const group = await this.groupService.create(input);

        await this.memberService.addMember(group.referenceId, user.id, 'owner');

        return {
            data: ExpenseGroupMapper.toResponse(group),
        };
    }

    @Put(':id')
    async update(@User('userId') userId: string, @Param('id') id: string, @Body(ValidationPipe) input: UpdateExpenseGroupDto) {
        const group = await this.groupService.findOne(id);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        const isAdmin = await this.memberService.isAdmin(group, userId);
        if (!isAdmin) throw new HttpException('You do not have permission to update this group', HttpStatus.UNAUTHORIZED);

        const updatedGroup = await this.groupService.update(group.id, input);

        return {
            data: ExpenseGroupMapper.toResponse(updatedGroup),
        };
    }

    @Delete(':id')
    async delete(@User('userId') userId: string, @Param('id') id: string) {
        const group = await this.groupService.findOne(id);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        const isAdmin = await this.memberService.isAdmin(group, userId);
        if (!isAdmin) throw new HttpException('You do not have permission to delete this group', HttpStatus.UNAUTHORIZED);

        await this.groupService.delete(group.id);
    }

    @Get(':id/balance/calculate')
    async calculateBalance(@User('userId') userId: string, @Param('id') id: string) {
        const group = await this.groupService.findOne(id);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(group, userId);
        if (!isMember) throw new HttpException('You do not have permission to delete this group', HttpStatus.UNAUTHORIZED);

        const balance = await this.groupService.calculateBalance(group.id);

        return { data: balance }
    }

    @Get(':id/balance/simplify')
    async simplifyBalance(@User('userId') userId: string, @Param('id') id: string): Promise<{ data: Transaction[] }> {
        const group = await this.groupService.findOne(id);
        if(!group) throw new HttpException('Group not found', HttpStatus.NOT_FOUND)

        const isMember = await this.memberService.isMember(group, userId);
        if (!isMember) throw new HttpException('You do not have permission to delete this group', HttpStatus.UNAUTHORIZED);

        const balance = await this.groupService.simplifyBalance(group.id);

        return { data: balance }
    }
}
