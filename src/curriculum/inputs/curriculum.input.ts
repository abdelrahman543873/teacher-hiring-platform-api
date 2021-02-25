import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
@InputType()
export class CurriculumInput {
  @MaxLength(255)
  @IsNotEmpty()
  @Field()
  enName: string;

  @MaxLength(255)
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
