// users.swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const SwaggerGetAllUsers = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({ status: 200, description: 'List of users' }),
  );
