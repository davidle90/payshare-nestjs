import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateExpenseDto {
  @ApiProperty({
    description: 'Updated expense name',
    example: 'Dinner at Italian restaurant',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Updated expense description',
    example: 'Dinner with friends (updated)',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ISO 4217 currency code',
    example: 'EUR',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Whether the expense is settled',
    example: false,
  })
  @IsBoolean()
  isSettled: boolean;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  editedByUserId?: string;
}
