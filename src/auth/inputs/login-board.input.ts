import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class LoginBoardInput {
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Field()
  password: string;
}
