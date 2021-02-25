import {
  Model,
  Table,
  PrimaryKey,
  DataType,
  Default,
  Column,
  AllowNull
} from 'sequelize-typescript';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Table({ paranoid: true, timestamps: true })
@ObjectType()
export class AppConfiguration extends Model<AppConfiguration> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(type => ID)
  id: string;

  @AllowNull(false)
  @Column
  @Field()
  key: string;

  @AllowNull(false)
  @Column
  @Field()
  value: string;

  @AllowNull(false)
  @Column
  @Field()
  displayAs: string;
}
