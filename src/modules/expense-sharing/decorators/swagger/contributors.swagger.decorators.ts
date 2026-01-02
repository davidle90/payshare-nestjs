// expense-contributors.swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateExpenseContributorDto } from '../../dto/requests/create-expense-contributor-dto';
import { UpdateExpenseContributorDto } from '../../dto/requests/update-expense-contributor-dto';
import { ExpenseContributorResponseDto } from '../../dto/responses/expense-contributor-response-dto';

export const SwaggerFindAllContributors = () =>
  applyDecorators(
    ApiOperation({ summary: 'List contributors of an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiOkResponse({
      schema: {
        example: { data: [] },
      },
    }),
  );

export const SwaggerFindOneContributor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a single contributor by ID' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiParam({ name: 'id', description: 'Contributor ID' }),
    ApiOkResponse({ type: ExpenseContributorResponseDto }),
    ApiNotFoundResponse({ description: 'Contributor not found' }),
  );

export const SwaggerCreateContributor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add a contributor to an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiBody({ type: CreateExpenseContributorDto }),
    ApiOkResponse({ type: ExpenseContributorResponseDto }),
    ApiNotFoundResponse({ description: 'Expense or Group not found' }),
    ApiUnauthorizedResponse({ description: 'User not a member of the group' }),
  );

export const SwaggerUpdateContributor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a contributor of an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiParam({ name: 'id', description: 'Contributor ID' }),
    ApiBody({ type: UpdateExpenseContributorDto }),
    ApiOkResponse({ type: ExpenseContributorResponseDto }),
    ApiNotFoundResponse({ description: 'Contributor, Expense, or Group not found' }),
    ApiUnauthorizedResponse({ description: 'User not authorized to update contributor' }),
  );

export const SwaggerDeleteContributor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a contributor from an expense' }),
    ApiParam({ name: 'expenseId', description: 'Expense ID' }),
    ApiParam({ name: 'id', description: 'Contributor ID' }),
    ApiResponse({ status: 204, description: 'Contributor deleted' }),
    ApiNotFoundResponse({ description: 'Contributor, Expense, or Group not found' }),
    ApiUnauthorizedResponse({ description: 'User not authorized to delete contributor' }),
  );
