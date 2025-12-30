import { UserMapper } from 'src/modules/users/mappers/user.mapper';
import { ExpenseGroupMemberResponseDto } from '../dto/responses/expense-group-member-response-dto';
import { ExpenseGroupMember } from '../entities/expense-group-member.entity';

export class ExpenseGroupMemberMapper {
  static toResponse(member: ExpenseGroupMember): ExpenseGroupMemberResponseDto {
    const response: ExpenseGroupMemberResponseDto = {
      object: 'expense_group_member',
      id: member.id,
      role: member.role,
      user: member.user ? UserMapper.toResponse(member.user) : null,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };

    if(member.group) {
      response.group = {
        object: 'expense_group',
        referenceId: member.group.referenceId,
        id: member.group.id,
        name: member.group.name,
      };
    }

    return response;
  }

  static toResponseList(members?: ExpenseGroupMember[]): ExpenseGroupMemberResponseDto[] {
    if (!members || members.length === 0) {
      return [];
    }
    return members.map(this.toResponse);
  }
}
