// swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ExpenseResponseDto } from 'src/modules/expense-sharing/dto/responses/expense-response-dto';

export const SwaggerFindAllExpenses = () =>
  applyDecorators(
    ApiOperation({ summary: 'List expenses' }),
    ApiOkResponse({
      schema: {
        example: {
          data: [],
          meta: { count: 0 },
        },
      },
    }),
    ApiQuery({ name: 'groupId', required: false }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'includes', required: false }),
  );

export const SwaggerFindOneExpense = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get expense by ID' }),
    ApiParam({ name: 'id', description: 'Expense ID' }),
    ApiQuery({ name: 'includes', required: false }),
    ApiOkResponse({ type: ExpenseResponseDto }),
    ApiNotFoundResponse({ description: 'Expense not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to view this expense' }),
  );

export const SwaggerCreateExpense = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create expense' }),
    ApiOkResponse({ type: ExpenseResponseDto }),
    ApiResponse({ status: 404, description: 'Group not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to create expense' }),
  );

export const SwaggerUpdateExpense = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update expense' }),
    ApiParam({ name: 'id', description: 'Expense ID' }),
    ApiOkResponse({ type: ExpenseResponseDto }),
    ApiNotFoundResponse({ description: 'Expense not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to update this expense' }),
  );

export const SwaggerDeleteExpense = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete expense' }),
    ApiParam({ name: 'id', description: 'Expense ID' }),
    ApiResponse({ status: 204, description: 'Expense deleted' }),
    ApiNotFoundResponse({ description: 'Expense not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to delete this expense' }),
  );

export const SwaggerFinalizeExpense = () =>
  applyDecorators(
    ApiOperation({ summary: 'Finalize expense' }),
    ApiParam({ name: 'id', description: 'Expense ID' }),
    ApiOkResponse({ description: 'Expense finalized' }),
    ApiNotFoundResponse({ description: 'Expense not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to finalize this expense' }),
  );
