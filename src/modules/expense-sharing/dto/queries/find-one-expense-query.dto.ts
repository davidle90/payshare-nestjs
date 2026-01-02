import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindOneExpenseQueryDto {
  @ApiPropertyOptional({
    description: 'Comma-separated list of relations to include',
    example: 'group,contributors',
  })
  @IsOptional()
  @IsString()
  includes?: string;
}
