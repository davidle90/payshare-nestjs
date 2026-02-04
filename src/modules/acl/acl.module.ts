import { Module } from '@nestjs/common';
import { PoliciesGuard } from './guards/policies.guard';

@Module({
  providers: [PoliciesGuard],
  exports: [PoliciesGuard],
})
export class AclModule {}
