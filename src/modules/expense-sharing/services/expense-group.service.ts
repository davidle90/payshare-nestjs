import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateExpenseGroupDto } from '../dto/create-expense-group-dto';
import { UpdateExpenseGroupMemberDto } from '../dto/update-expense-group-member-dto';
import { ExpenseGroupMember } from '../entities/expense-group-member.entity';
import { ExpenseGroup } from '../entities/expense-group.entity';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpenseGroupService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(ExpenseGroup) private readonly groupRepository: Repository<ExpenseGroup>,
        @InjectRepository(ExpenseGroupMember) private readonly memberRepository: Repository<ExpenseGroupMember>,
        @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>
    ) {}

    async findAll() {
        return await this.groupRepository.find();
    }

    async findOne(id: string) {
        return await this.groupRepository.findOneBy({ id });
    }

    async create(input: CreateExpenseGroupDto) {
        const group = this.groupRepository.create(input);
        return await this.groupRepository.save(group);
    }

    async update(id: string, input: CreateExpenseGroupDto) {
        return await this.groupRepository.update(id, input);
    }

    async delete(id: string) {
        return await this.groupRepository.delete(id);
    }

    async addMember(groupId: string, userId: string) {
        const userExists = await this.userRepository.findOneBy({ id: userId });

        if (!userExists) {
            throw new NotFoundException('User not found');
        }

        const member = this.memberRepository.create( {
            group: { id: groupId },
            user: { id: userId },
            role: 'member'
        });

        return await this.memberRepository.save(member);
    }

    async removeMember(groupId: string, userId: string) {
        const member = await this.memberRepository.findOne({
            where: {
            group: { id: groupId },
            user: { id: userId },
            },
        });

        if (!member) {
            throw new NotFoundException('Member not found');
        }

        return await this.memberRepository.remove(member);
    }

    async updateMember(memberId: string, input: UpdateExpenseGroupMemberDto) {
        const member = await this.memberRepository.findOneBy({ id: memberId });

        if (!member) {
            throw new NotFoundException('Member not found');
        }

        await this.memberRepository.update(member.id, input);
        const updatedMember = await this.memberRepository.findOneBy({ id: member.id });

        return updatedMember;
    }

    async inviteUserToGroup(userId: string, groupId: string) {
        return await `${userId} has been invited to join the group "${groupId}".`
    }
}
