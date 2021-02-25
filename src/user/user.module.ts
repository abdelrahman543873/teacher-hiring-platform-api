import { UserValidator } from 'src/user/user.validator';
import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserVerificationCodeRepository } from './repositories/user-verification-code.repository';
import { UserTransformer } from './user.transformer';
import { UserDataLoader } from './user.dataloader';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [
    UserRepository,
    UserVerificationCodeRepository,
    UserTransformer,
    UserDataLoader,
    UserResolver,
    UserValidator,
    UserService
  ],
  exports: [
    UserRepository,
    UserVerificationCodeRepository,
    UserTransformer,
    UserValidator,
    UserRepository
  ]
})
export class UserModule {}
