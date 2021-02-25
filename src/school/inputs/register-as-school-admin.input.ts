import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator';
import { CitiesEnum, DeviceEnum } from 'src/user/user.enum';
import { IsLandLineNumber } from 'src/_common/custom-validator/isLandLineNumber';
import { JSON } from 'src/_common/graphql/json.scalar';
import { SchoolTypeEnum } from '../school.enum';
import { IsCity } from '../../_common/custom-validator/isCity';

@InputType({
  description: 'school details data for registration as school admin'
})
export class SchoolRegistrationDetailsInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEnum(SchoolTypeEnum)
  @Field(() => SchoolTypeEnum)
  schoolType: SchoolTypeEnum;

  @IsNotEmpty()
  @IsCity()
  @MaxLength(255)
  @Field()
  city: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('ZZ', { message: 'School number must be a valid phone number' })
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsLandLineNumber('SA', { message: 'must be SA land line number' })
  @IsString()
  @Field({ description: 'landline number must be sa number ex: +966112459099' })
  landlineNumber: string;
}

@InputType({
  description: 'school admin details data for registration as school admin'
})
export class SchoolAdminRegistrationDetailsInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Field()
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Field({ nullable: true })
  lastName?: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  @IsString()
  @Field()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('ZZ', { message: 'school admin number must be a valid phone number' })
  @Field()
  phone: string;

  @Field(type => DeviceEnum)
  @IsEnum(DeviceEnum)
  @IsNotEmpty()
  device: DeviceEnum;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @IsOptional()
  @Field(type => JSON, { nullable: true })
  platformDetails?: Record<string, any>;
}

@InputType({
  description:
    'this is first step in registration as school admin it must query this resolver first to give him jwt token and send back otp with phone message'
})
export class RegisterAsSchoolInput {
  @ValidateNested()
  @Type(() => SchoolRegistrationDetailsInput)
  @Field(() => SchoolRegistrationDetailsInput)
  school: SchoolRegistrationDetailsInput;
  @ValidateNested()
  @Type(() => SchoolAdminRegistrationDetailsInput)
  @Field(() => SchoolAdminRegistrationDetailsInput)
  admin: SchoolAdminRegistrationDetailsInput;
}
