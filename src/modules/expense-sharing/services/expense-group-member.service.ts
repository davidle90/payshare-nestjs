import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateExpenseGroupMemberDto } from '../dto/update-expense-group-member-dto';
import { ExpenseGroupMember } from '../entities/expense-group-member.entity';
import { ExpenseGroup } from '../entities/expense-group.entity';
import { ExpenseGroupService } from './expense-group.service';

@Injectable()
export class ExpenseGroupMemberService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(ExpenseGroup) private readonly groupRepository: Repository<ExpenseGroup>,
        @InjectRepository(ExpenseGroupMember) private readonly memberRepository: Repository<ExpenseGroupMember>,
        private readonly expenseGroupService: ExpenseGroupService
    ) {}

    async addMember(groupId: string, userId: string, role: string = 'member') {
        const userExists = await this.userRepository.findOneBy({ id: userId });

        if (!userExists) {
            throw new NotFoundException('User not found');
        }

        const member = this.memberRepository.create( {
            group: { id: groupId },
            user: { id: userId },
            role
        });

        return await this.memberRepository.save(member);
    }

    async removeMember(groupId: string, userId: string) {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: [
                'expenses',
                'expenses.participants',
                'expenses.contributors'
            ]
        });

        if (!group) throw new NotFoundException('Group not found');

        const member = await this.memberRepository.findOne({
            where: { group: { id: groupId }, user: { id: userId } },
        });

        if (!member) throw new NotFoundException('Member not found');

        await this.groupRepository.manager.transaction(async manager => {
            await manager.remove(member);

            await manager
                .createQueryBuilder()
                .delete()
                .from('expense_participant')
                .where(`memberId = :userId AND expenseId IN (SELECT id FROM expense WHERE groupId = :groupId)`, { userId, groupId })
                .execute();

            await manager
                .createQueryBuilder()
                .delete()
                .from('expense_contributor')
                .where(`memberId = :userId AND expenseId IN (SELECT id FROM expense WHERE groupId = :groupId)`, { userId, groupId })
                .execute();

            await manager
                .createQueryBuilder()
                .delete()
                .from('expense_debt')
                .where('groupId = :groupId', { groupId })
                .andWhere('(fromUserId = :userId OR toUserId = :userId)', { userId })
                .execute();
        });

        return await this.expenseGroupService.calculateBalance(group);
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
