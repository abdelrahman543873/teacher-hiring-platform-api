import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsPhoneNumber } from 'class-validator';

@ArgsType()
export class SendPhoneVerificationCodeInput {
  @IsOptional()
  @IsPhoneNumber('ZZ')
  @Field({
    nullable: true,
    description:
      'provide it if you want to provide updated phone number this value well be over write the old value of unverified phone if exist'
  })
  updatedPhone?: string;
}
