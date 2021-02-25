import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { SortEnum } from 'src/_common/graphql/graphql.enum';
import { PaginatorInput } from 'src/_common/paginator/paginator.input';
import { TeacherOrSchoolAdminEnum } from '../user-updates.enum';

@InputType()
export class ViewUsersRequestsOrderByOptions {
  @IsEnum(SortEnum)
  @Field(() => SortEnum)
  createdAt: SortEnum;
}

@InputType()
export class ViewUsersRequestsFilterByOptions {
  @IsEnum(TeacherOrSchoolAdminEnum)
  @Field(() => TeacherOrSchoolAdminEnum)
  role: TeacherOrSchoolAdminEnum;
}

@InputType()
export class ViewUsersRequestsInput extends PaginatorInput {
  @IsOptional()
  @ValidateNested()
  @Field(() => [ViewUsersRequestsOrderByOptions], { nullable: 'itemsAndList' })
  sortBy?: ViewUsersRequestsOrderByOptions[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ViewUsersRequestsFilterByOptions)
  @Field(() => ViewUsersRequestsFilterByOptions, { nullable: true })
  filterBy?: ViewUsersRequestsFilterByOptions;
}
