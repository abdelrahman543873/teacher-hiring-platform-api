import { registerEnumType } from '@nestjs/graphql';

export enum ChatStatusEnum {
  ARCHIVED = 'ARCHIVED',
  FAVORITE = 'FAVORITE'
}

registerEnumType(ChatStatusEnum, { name: 'ChatStatusEnum' });
