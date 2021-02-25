import { ObjectType, Field, Float } from '@nestjs/graphql';
import { JSON } from 'src/_common/graphql/json.scalar';
import { Timestamp } from 'src/_common/graphql/timestamp.scalar';
import { DeviceEnum } from './user.enum';

export class FcmTokensType {
  android?: string;
  ios?: string;
  desktop?: string;
}
@ObjectType()
export class LocationType {
  @Field()
  type: string;

  // https://postgis.net/2013/08/18/tip_lon_lat/
  // long,lat
  @Field(() => [Float], { description: '[long,lat]' })
  coordinates: number[];
}

@ObjectType()
export class LastLoginDetails {
  @Field(() => Timestamp)
  lastLoginAt: Timestamp | number | Date;

  @Field(() => DeviceEnum)
  lastLoginDevice: DeviceEnum;

  @Field(() => JSON, { nullable: true })
  platformDetails?: Record<string, unknown>;
}
