import { Field, ObjectType } from '@nestjs/graphql';
import { SchoolAttachmentTypeEnum } from './school.enum';

@ObjectType()
export class SchoolAttachment {
  @Field(() => SchoolAttachmentTypeEnum)
  type: SchoolAttachmentTypeEnum;

  @Field()
  path: string;
}

export enum FOR_WHICH_TO_VALIDATE {
  SCHOOL = 'SCHOOL',
  USER = 'USER'
}
