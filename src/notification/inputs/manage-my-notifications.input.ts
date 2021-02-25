import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsBoolean } from 'class-validator';

@InputType()
export class ManageMyNotificationsInput {
  @IsBoolean()
  @IsNotEmpty()
  @Field()
  VIA_EMAIL: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  VIA_PUSH: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Field()
  WHEN_RECOMMENDATIONS: boolean;
}
