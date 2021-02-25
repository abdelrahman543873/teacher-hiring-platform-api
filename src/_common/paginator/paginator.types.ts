import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WhereOptions, Includeable } from 'sequelize/types';

export interface PaginationRes<T> {
  items: T[];
  pageInfo: {
    page: number;
    hasNext: boolean;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

@ObjectType()
export abstract class PageInfo {
  @Field(type => Int)
  totalCount: number;

  @Field(type => Int)
  totalPages: number;

  @Field(type => Int)
  page: number;

  @Field(type => Int)
  limit: number;

  @Field(type => Boolean)
  hasNext: boolean;
}

export interface IPaginatedFilter {
  where?: WhereOptions;
  sort?: string;
  page?: number;
  limit?: number;
  include?: Includeable[];
}
