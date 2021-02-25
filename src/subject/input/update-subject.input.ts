import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsUUID } from 'class-validator';
@InputType()
export class UpdateSubjectInput {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  enName?: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  arName?: string;

  @IsOptional()
  @Field({ nullable: true })
  arDescription?: string;

  @IsOptional()
  @Field({ nullable: true })
  enDescription?: string;
}
