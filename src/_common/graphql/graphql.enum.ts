import { registerEnumType } from '@nestjs/graphql';

export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(SortEnum, {
  name: 'SortEnum'
});
