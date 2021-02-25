import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Model,
  Table,
  PrimaryKey,
  DataType,
  Default,
  Column,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { ModelWhichUploadedFor } from './uploader.type';

@ObjectType()
@Table({
  timestamps: true,
  indexes: [{ fields: [{ name: 'hasReferenceAtDatabase' }] }],
  paranoid: true
})
export class File extends Model<File> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(type => ID)
  id: string;

  @AllowNull(false)
  @Column
  @Field()
  relativeDiskDestination: string;

  @AllowNull(false)
  @Column
  @Field()
  name: string;

  @AllowNull(false)
  @Column
  @Field()
  encoding: string;

  @AllowNull(false)
  @Column
  @Field()
  mimetype: string;

  @Default(0)
  @Column
  @Field()
  sizeInBytes: number;

  @Default([])
  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  downloadedByUsersIds?: string[];

  @Default(false)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  hasReferenceAtDatabase: boolean;

  @AllowNull(true)
  @Column({ type: DataType.JSONB })
  modelWhichUploadedFor?: ModelWhichUploadedFor;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column({ onDelete: 'SET NULL', type: DataType.UUID })
  uploadedById?: string;

  @BelongsTo(() => User)
  uploadedBy?: User;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
