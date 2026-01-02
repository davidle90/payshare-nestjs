import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseGroupResponseDto } from './expense-group-response-dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response-dto';
import { ExpenseParticipantResponseDto } from './expense-participant-response-dto';
import { ExpenseContributorResponseDto } from './expense-contributor-response-dto';

export class ExpenseResponseDto {
  @ApiProperty({
    description: 'Object type discriminator',
    example: 'expense',
  })
  object: 'expense';

  @ApiProperty({ example: 'exp_123456' })
  id: string;

  @ApiProperty({ example: 'REF-2024-0001' })
  referenceId: string;

  @ApiProperty({ example: 'grp_123456' })
  groupId: string;

  @ApiProperty({ example: 'Dinner at restaurant' })
  name: string;

  @ApiProperty({ example: 'Dinner with friends' })
  description: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({
    description: 'Total expense amount',
    example: 125.5,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Expense status',
    example: 'open',
  })
  status: string;

  @ApiProperty({
    description: 'Whether the expense is settled',
    example: false,
  })
  isSettled: boolean;

  @ApiPropertyOptional({
    description: 'User ID who last edited the expense',
    example: 'usr_123456',
  })
  editedByUserId: string | null | undefined;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T15:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: () => UserResponseDto,
  })
  createdByUser?: UserResponseDto;

  @ApiPropertyOptional({
    type: () => ExpenseGroupResponseDto,
  })
  group?: ExpenseGroupResponseDto;

  @ApiPropertyOptional({
    type: () => ExpenseContributorResponseDto,
    isArray: true,
  })
  contributors?: ExpenseContributorResponseDto[];

  @ApiPropertyOptional({
    type: () => ExpenseParticipantResponseDto,
    isArray: true,
  })
  participants?: ExpenseParticipantResponseDto[];
}
