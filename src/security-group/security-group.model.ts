import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AllowNull,
  Default,
  Unique,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ID, Field, ObjectType } from '@nestjs/graphql';
import { ValidPermissions } from 'src/_common/custom-validator/valid-permissions';

@ObjectType()
@Table({ timestamps: true, paranoid: true })
export class SecurityGroup extends Model<SecurityGroup> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column({ type: DataType.UUID })
  @Field(() => ID)
  id: string;

  @Unique
  @AllowNull(false)
  @Column
  @Field()
  groupName: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  description?: string;

  @ValidPermissions()
  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  @Field(() => [String])
  permissions: string[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
