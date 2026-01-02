// auth.swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const SwaggerRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Register account' }),
    ApiResponse({ status: 200, description: 'User registered successfully' }),
  );

export const SwaggerVerifyEmail = () =>
  applyDecorators(
    ApiOperation({ summary: 'Verify email address' }),
    ApiQuery({ name: 'token', required: true, description: 'Email verification token' }),
    ApiResponse({ status: 200, description: 'Email verified successfully' }),
    ApiResponse({ status: 400, description: 'Invalid or expired token' }),
  );

export const SwaggerLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiResponse({ status: 200, description: 'Login successful' }),
  );

export const SwaggerCheckAuth = () =>
  applyDecorators(
    ApiOperation({ summary: 'Check authentication status' }),
    ApiBearerAuth(), // Indicates this endpoint requires JWT auth
    ApiResponse({ status: 200, description: 'Authenticated' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
