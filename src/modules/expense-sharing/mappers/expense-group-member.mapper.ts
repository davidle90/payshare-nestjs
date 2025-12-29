import { UserMapper } from 'src/modules/users/mappers/user.mapper';
import { ExpenseGroupMemberResponseDto } from '../dto/expense-group-member-response-dto';
import { ExpenseGroupMember } from '../entities/expense-group-member.entity';

export class ExpenseGroupMemberMapper {
  static toResponse(member: ExpenseGroupMember): ExpenseGroupMemberResponseDto {
    return {
      id: member.id,
      role: member.role,
      user: member.user ? UserMapper.toResponse(member.user) : null,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  static toResponseList(members?: ExpenseGroupMember[]): ExpenseGroupMemberResponseDto[] {
    if (!members || members.length === 0) {
      return [];
    }
    return members.map(this.toResponse);
  }
}
