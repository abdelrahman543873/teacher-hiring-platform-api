import { InputType, Field, ID } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
  IsUUID
} from 'class-validator';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SendMessageInput {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @Field(() => ID)
  receiverId: string;

  @IsOptional()
  @IsString()
  @Field()
  content: string;

  @IsOptional()
  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', {
    each: true
  })
  @Field(() => [ID])
  attachments: string;
}
