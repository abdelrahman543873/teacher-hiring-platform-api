import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

@InputType()
export class ResetPasswordByPhoneInput {
  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('ZZ')
  phone: string;

  @Field()
  @IsNotEmpty()
  code: string;

  @Field()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  newPassword: string;
}
