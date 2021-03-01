import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { IPaginateInput } from 'src/_common/paginator/paginator.interface';
import { paginate } from 'src/_common/paginator/paginator.service';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsString, IsUUID } from 'class-validator';
import { ArrayUnique } from 'class-validator';
import { User } from 'src/user/models/user.model';
import { Chat } from './chat.model';

@Table({
  timestamps: true,
  paranoid: true,
  indexes: []
})
@ObjectType()
export class Message extends Model<Message> {
  @ForeignKey(() => User)
  @Column
  @Field(() => ID)
  senderId: string;

  @ForeignKey(() => User)
  @Column
  @Field(() => ID)
  receiverId: string;

  @BelongsTo(() => User, 'senderId')
  @Field(() => User)
  sender: User;

  @BelongsTo(() => User, 'receiverId')
  @Field(() => User)
  receiver: User;

  @ForeignKey(() => Chat)
  @Column
  @Field(() => ID)
  chatId: string;

  @BelongsTo(() => Chat)
  @Field(() => Chat)
  chat: Chat;

  @IsString()
  @Column
  @Field()
  content: string;

  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  @Field(() => [ID])
  attachments: string[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  @Field(() => Timestamp)
  createdAt: Date;

  static async paginate(input: IPaginateInput) {
    return paginate<Message>(this, input, false);
  }
}
