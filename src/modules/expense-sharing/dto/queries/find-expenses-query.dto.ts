import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindExpensesQueryDto {
  @ApiPropertyOptional({
    description: 'Filter expenses by group ID',
    example: 'grp_123456',
  })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Search term for expense name or description',
    example: 'dinner',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated list of relations to include',
    example: 'group,contributors,participants',
  })
  @IsOptional()
  @IsString()
  includes?: string;
}
