import { Literal } from 'sequelize/types/lib/utils';

export interface IPaginateInput {
  filter?: Record<string, any>;
  sort?: Record<string, any>[] | Literal;
  page?: number;
  limit?: number;
  include?: any;
  attributes?: any;
}
