import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { ChatStatusEnum } from '../chat.enum';
import { Timestamp } from '../../_common/graphql/timestamp.scalar';
import { IPaginateInput } from 'src/_common/paginator/paginator.interface';
import { paginate } from 'src/_common/paginator/paginator.service';
import { Chat } from './chat.model';

@Table
@ObjectType()
export class UserChat extends Model<UserChat> {
  @ForeignKey(() => User)
  @Column
  @Field(() => ID)
  ownerId: string;

  @BelongsTo(() => User, 'ownerId')
  @Field(() => User)
  owner: User;

  @ForeignKey(() => User)
  @Column
  @Field(() => ID)
  recipientId: string;

  @BelongsTo(() => User, 'recipientId')
  @Field(() => User)
  recipient: User;

  @ForeignKey(() => Chat)
  @Column
  @Field(() => ID)
  chatId: string;

  @BelongsTo(() => Chat, 'chatId')
  @Field(() => Chat)
  chat: Chat;

  @Column
  @Field(() => ChatStatusEnum)
  status: ChatStatusEnum;

  @Default('1996-02-25T11:53:06.521Z')
  @Column
  @Field(() => Timestamp)
  lastDeleted: Date;

  @CreatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp)
  createdAt: Date;

  static async paginate(input: IPaginateInput) {
    return paginate<UserChat>(this, input);
  }
}
