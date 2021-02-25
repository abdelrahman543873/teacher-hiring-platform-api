import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateCurriculumInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  enName?: string;

  @Field({ nullable: true })
  arName?: string;

  @Field({ nullable: true })
  arDescription?: string;

  @Field({ nullable: true })
  enDescription?: string;
}
