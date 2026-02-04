import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { UpdateExpenseGroupMemberDto } from '../dto/requests/update-expense-group-member-dto';
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

    async findAll(groupId: string) {
        return await this.memberRepository.find({
            where: { group: { id: groupId } },
            relations: ['user', 'group']
        });
    }

    async findOne(id: string) {
        return await this.memberRepository.findOne({
            where: { id },
            relations: ['user', 'group']
        });
    }

    async addMember(referenceId: string, userId: string, role: 'owner' | 'admin' | 'member' = 'member') {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new NotFoundException('User not found');

        const group = await this.groupRepository.findOneBy({ referenceId });
        if (!group) throw new NotFoundException('Group not found');

        const existing = await this.memberRepository.findOne({
            where: { group: { id: group.id }, user: { id: user.id } },
        });
        if (existing) throw new BadRequestException('User is already a member');

        const member = this.memberRepository.create({ group, user, role });

        await this.memberRepository.save(member)
        return member;
    }

    async removeMember(groupId: string, memberId: string) {
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
            where: { group: { id: groupId }, id: memberId },
            relations: ['user'],
        });

        if (!member) throw new NotFoundException('Member not found');

        const userId = member.user.id;

        await this.groupRepository.manager.transaction(async manager => {
            // Update related records in other tables that reference this member
            await manager
                .createQueryBuilder()
                .update('expense_participant')
                .set({ memberId: null })  // Set memberId to NULL
                .where(`"memberId" = :userId AND "expenseId" IN (SELECT "id" FROM "expense" WHERE "groupId" = :groupId)`, { userId, groupId })
                .execute();

            await manager
                .createQueryBuilder()
                .update('expense_contributor')
                .set({ memberId: null })  // Set memberId to NULL
                .where(`"memberId" = :userId AND "expenseId" IN (SELECT "id" FROM "expense" WHERE "groupId" = :groupId)`, { userId, groupId })
                .execute();

            await manager
                .createQueryBuilder()
                .update('expense_debt')
                .set({ fromUserId: null })  // Set related user IDs to NULL
                .where('groupId = :groupId', { groupId })
                .andWhere('(fromUserId = :userId)', { userId })
                .execute();

            await manager
                .createQueryBuilder()
                .update('expense_debt')
                .set({ toUserId: null })  // Set related user IDs to NULL
                .where('groupId = :groupId', { groupId })
                .andWhere('(toUserId = :userId)', { userId })
                .execute();

            // Now, delete the member from the group
            await manager.remove(member);

            // Optionally, you could also delete the group if it's empty and no longer needed
            // await manager.remove(group);
        });

        return await this.expenseGroupService.calculateBalance(group.id);
    }

    async updateMember(memberId: string, input: UpdateExpenseGroupMemberDto) {
        const member = await this.memberRepository.findOneBy({ id: memberId });

        if (!member) {
            throw new NotFoundException('Member not found');
        }

        await this.memberRepository.update(member.id, input);
        const updatedMember = await this.memberRepository.findOne({
            where: { id: member.id },
            relations: ['user', 'group'],
        });

        return updatedMember;
    }

    async inviteUserToGroup(userId: string, groupId: string) {
        return await `${userId} has been invited to join the group "${groupId}".`
    }

    async isOwner(group: ExpenseGroup, userId: string) {
        const isAdmin = await this.memberRepository.exists({
            where: { group: { id: group.id }, user: { id: userId }, role: In(['owner']) }
        });

        return isAdmin;
    }

    async isAdmin(group: ExpenseGroup, userId: string) {
        const isAdmin = await this.memberRepository.exists({
            where: { group: { id: group.id }, user: { id: userId }, role: In(['admin', 'owner']) }
        });

        return isAdmin;
    }

    async isMember(group: ExpenseGroup, userId: string) {
        const isMember = await this.memberRepository.exists({
            where: { group: { id: group.id }, user: { id: userId } }
        });

        return isMember;
    }

    async getMemberByUserId(groupId: string, userId: string): Promise<ExpenseGroupMember | null> {
        return await this.memberRepository.findOne({
            where: { group: { referenceId: groupId }, user: { id: userId } },
            relations: ['user', 'group'],
        });
    }
}
