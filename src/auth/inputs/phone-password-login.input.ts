import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator';
import { DeviceEnum } from 'src/user/user.enum';
import { JSON } from 'src/_common/graphql/json.scalar';

@InputType()
export class PhoneAndPasswordLoginInput {
  @IsNotEmpty()
  @IsPhoneNumber('ZZ')
  @Field()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Field()
  password: string;

  @IsNotEmpty()
  @IsEnum(DeviceEnum)
  @Field(() => DeviceEnum)
  device: DeviceEnum;

  @ValidateIf(o => o.lon)
  @IsNotEmpty()
  @IsLatitude()
  @Field({ nullable: true })
  lat?: number;

  @ValidateIf(o => o.lat)
  @IsNotEmpty()
  @IsLongitude()
  @Field({ nullable: true })
  lon?: number;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  platformDetails?: Record<string, unknown>;
}
