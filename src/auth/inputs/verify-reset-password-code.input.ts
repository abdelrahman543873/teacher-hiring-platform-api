import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

@InputType()
export class VerifyResetPasswordVerificationCode {
  @IsNotEmpty()
  @IsPhoneNumber('ZZ')
  @Field()
  phone: string;

  @IsNotEmpty()
  @Field()
  code: string;
}
