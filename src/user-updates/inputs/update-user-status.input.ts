import { InputType, Field } from '@nestjs/graphql';
import { StatusEnum } from '../../user/user.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserStatusInput {
  @IsNotEmpty()
  @Field()
  id: string;

  @IsEnum(StatusEnum)
  @Field(() => StatusEnum)
  status: StatusEnum;

  @Field(() => [String], { nullable: 'itemsAndList' })
  rejectionReasons?: string[];
}
