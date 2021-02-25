import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class VerifyUserByPhoneInput {
  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('ZZ')
  phone: string;

  @Field()
  @IsNotEmpty()
  verificationCode: string;
}
