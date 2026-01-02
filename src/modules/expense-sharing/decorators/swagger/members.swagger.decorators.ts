// expense-group-members.swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateExpenseGroupMemberDto } from '../../dto/requests/create-expense-group-member-dto';
import { UpdateExpenseGroupMemberDto } from '../../dto/requests/update-expense-group-member-dto';
import { ExpenseGroupMemberResponseDto } from '../../dto/responses/expense-group-member-response-dto';

export const SwaggerFindAllMembers = () =>
  applyDecorators(
    ApiOperation({ summary: 'List members of an expense group' }),
    ApiParam({ name: 'groupId', description: 'Expense group ID' }),
    ApiOkResponse({
      schema: {
        example: {
          data: [],
          meta: { count: 0 },
        },
      },
    }),
    ApiNotFoundResponse({ description: 'Group not found' }),
  );

export const SwaggerAddMember = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add a member to an expense group' }),
    ApiParam({ name: 'groupId', description: 'Expense group ID' }),
    ApiBody({ type: CreateExpenseGroupMemberDto }),
    ApiOkResponse({ type: ExpenseGroupMemberResponseDto }),
    ApiNotFoundResponse({ description: 'Group not found' }),
  );

export const SwaggerUpdateMember = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a member of an expense group' }),
    ApiParam({ name: 'groupId', description: 'Expense group ID' }),
    ApiParam({ name: 'memberId', description: 'Member ID' }),
    ApiBody({ type: UpdateExpenseGroupMemberDto }),
    ApiOkResponse({ type: ExpenseGroupMemberResponseDto }),
    ApiNotFoundResponse({ description: 'Group or member not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to update members' }),
  );

export const SwaggerRemoveMember = () =>
  applyDecorators(
    ApiOperation({ summary: 'Remove a member from an expense group' }),
    ApiParam({ name: 'groupId', description: 'Expense group ID' }),
    ApiParam({ name: 'memberId', description: 'Member ID' }),
    ApiResponse({ status: 204, description: 'Member removed' }),
    ApiNotFoundResponse({ description: 'Group not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to remove members' }),
  );
