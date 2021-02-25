import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';
import { NotExistRecord } from './notification.type';

export const NotificationParentUnion = createUnionType({
  name: 'NotificationParentUnion',
  types: () => [User, NotExistRecord],
  resolveType(value: User | NotExistRecord) {
    if ((<User>value).email) return User;
    return NotExistRecord;
  },
});
