import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsString,
  IsEnum,
  IsISO31661Alpha2,
  ValidateIf,
  IsLongitude,
  IsLatitude
} from 'class-validator';
import { DeviceEnum } from 'src/user/user.enum';
import { JSON } from 'src/_common/graphql/json.scalar';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @IsOptional()
  @MaxLength(30)
  @Field({ nullable: true })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  bio?: string;

  @ValidateIf(o => !o.phone)
  @IsEmail()
  @IsNotEmpty()
  @Field({ nullable: true })
  email?: string;

  @ValidateIf(o => !o.email)
  @IsPhoneNumber('ZZ')
  @IsNotEmpty()
  @Field({ nullable: true })
  phone?: string;

  @Field()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @ValidateIf(o => o.lat)
  @IsLongitude()
  @IsNotEmpty()
  @Field({ nullable: true })
  long?: number;

  @ValidateIf(o => o.long)
  @IsLatitude()
  @IsNotEmpty()
  @Field({ nullable: true })
  lat?: number;

  @Field(() => DeviceEnum, { defaultValue: DeviceEnum.ANDROID })
  @IsEnum(DeviceEnum)
  @IsNotEmpty()
  device: DeviceEnum;

  @IsISO31661Alpha2()
  @IsOptional()
  @Field({ defaultValue: 'EG' })
  country: string;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  platformDetails?: object;
}
