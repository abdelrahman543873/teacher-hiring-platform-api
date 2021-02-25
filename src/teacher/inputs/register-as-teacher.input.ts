import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsPhoneNumber, IsEnum } from 'class-validator';
import { GenderEnum, LangEnum, DeviceEnum } from '../../user/user.enum';
import { IsCity } from '../../_common/custom-validator/isCity';
import { IsEmail } from 'class-validator';
import { JSON } from 'src/_common/graphql/json.scalar';
@InputType()
export class registerAsTeacherInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('ZZ')
  @Field()
  unverifiedPhone: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  @Field()
  password: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  @Field(() => GenderEnum)
  gender: GenderEnum;

  @IsNotEmpty()
  @IsCity()
  @Field()
  city: string;

  @Field(() => LangEnum)
  favLang: LangEnum;

  @Field({ nullable: true })
  fcmToken?: string;

  @Field(() => DeviceEnum)
  device: DeviceEnum;

  @Field(() => JSON, { nullable: true })
  platformDetails?: Record<string, any>;
}
