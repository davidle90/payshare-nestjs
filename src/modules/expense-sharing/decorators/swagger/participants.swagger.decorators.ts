// expense-participants.swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateExpenseParticipantDto } from '../../dto/requests/create-expense-participant-dto';
import { UpdateExpenseParticipantDto } from '../../dto/requests/update-expense-participant-dto';
import { ExpenseParticipantResponseDto } from '../../dto/responses/expense-participant-response-dto';

export const SwaggerFindAllParticipants = () =>
  applyDecorators(
    ApiOperation({ summary: 'List participants of an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiOkResponse({
      schema: { example: { data: [] } },
    }),
  );

export const SwaggerFindOneParticipant = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a participant by ID' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiParam({ name: 'id', description: 'Participant ID' }),
    ApiOkResponse({ type: ExpenseParticipantResponseDto }),
    ApiNotFoundResponse({ description: 'Participant not found' }),
  );

export const SwaggerCreateParticipant = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add a participant to an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiBody({ type: CreateExpenseParticipantDto }),
    ApiOkResponse({ type: ExpenseParticipantResponseDto }),
    ApiNotFoundResponse({ description: 'Expense or group not found' }),
    ApiUnauthorizedResponse({ description: 'User not a member of the group' }),
  );

export const SwaggerUpdateParticipant = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a participant of an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiParam({ name: 'id', description: 'Participant ID' }),
    ApiBody({ type: UpdateExpenseParticipantDto }),
    ApiOkResponse({ type: ExpenseParticipantResponseDto }),
    ApiNotFoundResponse({ description: 'Participant, expense, or group not found' }),
    ApiUnauthorizedResponse({ description: 'User not authorized to update participant' }),
  );

export const SwaggerDeleteParticipant = () =>
  applyDecorators(
    ApiOperation({ summary: 'Remove a participant from an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiParam({ name: 'id', description: 'Participant ID' }),
    ApiResponse({ status: 204, description: 'Participant deleted' }),
    ApiNotFoundResponse({ description: 'Participant, expense, or group not found' }),
    ApiUnauthorizedResponse({ description: 'User not authorized to delete participant' }),
  );
