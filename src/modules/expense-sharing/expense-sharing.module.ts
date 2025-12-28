import { Module } from '@nestjs/common';
import { ExpenseSharingService } from './expense-sharing.service';
import { ExpenseSharingController } from './expense-sharing.controller';

@Module({
  providers: [ExpenseSharingService],
  controllers: [ExpenseSharingController]
})
export class ExpenseSharingModule {}
