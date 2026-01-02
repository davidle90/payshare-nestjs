// expense-groups.swagger.decorators.ts
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
import { ExpenseGroupResponseDto } from '../../dto/responses/expense-group-response-dto';

export const SwaggerFindAllGroups = () =>
  applyDecorators(
    ApiOperation({ summary: 'List expense groups' }),
    ApiOkResponse({
      schema: {
        example: {
          data: [],
          meta: { count: 0 },
        },
      },
    }),
    ApiQuery({ name: 'search', required: false }),
    ApiQuery({ name: 'includes', required: false }),
  );

export const SwaggerFindOneGroup = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get expense group by ID' }),
    ApiParam({ name: 'id', description: 'Expense group ID' }),
    ApiQuery({ name: 'includes', required: false }),
    ApiOkResponse({ type: ExpenseGroupResponseDto }),
    ApiNotFoundResponse({ description: 'Group not found' }),
  );

export const SwaggerCreateGroup = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create expense group' }),
    ApiOkResponse({ type: ExpenseGroupResponseDto }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );

export const SwaggerUpdateGroup = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update expense group' }),
    ApiParam({ name: 'id', description: 'Expense group ID' }),
    ApiOkResponse({ type: ExpenseGroupResponseDto }),
    ApiNotFoundResponse({ description: 'Group not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to update this group' }),
  );

export const SwaggerDeleteGroup = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete expense group' }),
    ApiParam({ name: 'id', description: 'Expense group ID' }),
    ApiResponse({ status: 204, description: 'Group deleted' }),
    ApiNotFoundResponse({ description: 'Group not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to delete this group' }),
  );

export const SwaggerCalculateBalance = () =>
  applyDecorators(
    ApiOperation({ summary: 'Calculate expense group balance' }),
    ApiParam({ name: 'id', description: 'Expense group ID' }),
    ApiOkResponse({
      description: 'Balance calculated',
      schema: { example: { data: {} } },
    }),
    ApiNotFoundResponse({ description: 'Group not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to view this group' }),
  );

export const SwaggerSimplifyBalance = () =>
  applyDecorators(
    ApiOperation({ summary: 'Simplify expense group balance' }),
    ApiParam({ name: 'id', description: 'Expense group ID' }),
    ApiOkResponse({
      description: 'Simplified transactions',
      schema: { example: { data: [] } },
    }),
    ApiNotFoundResponse({ description: 'Group not found' }),
    ApiUnauthorizedResponse({ description: 'No permission to view this group' }),
  );
