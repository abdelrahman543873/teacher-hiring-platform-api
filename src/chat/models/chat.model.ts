import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Message } from './message.model';

@Table
@ObjectType()
export class Chat extends Model<Chat> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @HasMany(() => Message)
  @Field(() => [Message])
  messages: Message[];
}
