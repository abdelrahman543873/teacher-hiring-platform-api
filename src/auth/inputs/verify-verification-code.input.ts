import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class VerifyPhoneVerificationCodeInput {
  @IsNotEmpty()
  @Length(4, 4)
  @IsString()
  @Field()
  code: string;
}
