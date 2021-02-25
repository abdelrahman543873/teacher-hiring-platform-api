import { Module } from '@nestjs/common';
import { TestingResolversService } from './testing-resolvers.service';
import { TestingResolversResolver } from './testing-resolvers.resolver';

@Module({
  providers: [TestingResolversService, TestingResolversResolver]
})
export class TestingResolversModule {}
