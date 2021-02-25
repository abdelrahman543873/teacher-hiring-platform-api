import { InputType, Field, ArgsType } from '@nestjs/graphql';
import { Min, IsOptional, ValidateNested } from 'class-validator';

@InputType()
export class PaginatorInput {
  @Min(1)
  @Field({ defaultValue: 1 })
  page?: number;

  @Min(1)
  @Field({ defaultValue: 15 })
  limit?: number;
}

@ArgsType()
export class NullablePaginatorInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  paginate?: PaginatorInput;
}
