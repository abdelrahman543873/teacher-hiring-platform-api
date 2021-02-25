import { Module } from '@nestjs/common';
import { SecurityGroupRepository } from './security-group.repository';

@Module({
  imports: [],
  providers: [SecurityGroupRepository],
  exports: [SecurityGroupRepository]
})
export class SecurityGroupModule {}
