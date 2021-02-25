import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
@InputType()
export class SubjectInput {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @Field()
  enName: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  @Field()
  arName: string;

  @IsOptional()
  @Field({ nullable: true })
  arDescription?: string;

  @IsOptional()
  @Field({ nullable: true })
  enDescription?: string;
}
