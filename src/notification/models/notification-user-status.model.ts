import {
  Table,
  Model,
  DataType,
  Column,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { Notification } from './notification.model';
import { ObjectType } from '@nestjs/graphql';

@Table({
  timestamps: true,
  indexes: [
    {
      fields: [
        { name: 'receiverId' },
        { name: 'notificationId' },
        { name: 'seenAt' },
      ],
    },
  ],
})
@ObjectType()
export class NotificationUserStatus extends Model<NotificationUserStatus> {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  receiverId: string;

  @BelongsTo(() => User)
  receiver: User;

  @ForeignKey(() => Notification)
  @AllowNull(false)
  @Column({ type: DataType.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  notificationId: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  seenAt?: Date;
}
