import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense group ID',
    example: 'grp_123456',
  })
  @IsString()
  groupId: string;

  @ApiProperty({
    description: 'Expense name',
    example: 'Dinner at restaurant',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Expense description',
    example: 'Dinner with friends on Friday',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ISO 4217 currency code',
    example: 'USD',
  })
  @IsString()
  currency: string;
}
