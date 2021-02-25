import { Field, Float, ID, InputType } from '@nestjs/graphql';
import {
  IsLongitude,
  IsNotEmpty,
  IsLatitude,
  ArrayUnique,
  IsEnum,
  IsUUID,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  IsOptional
} from 'class-validator';
import { EducationalGradesEnum } from 'src/teacher/teacher.enums';
import { getValuesFromEnum } from 'src/_common/utils/columnEnum';
import { SchoolAttachmentTypeEnum, SchoolGenderEnum } from '../school.enum';

@InputType()
export class SchoolAttachmentsInput {
  @IsEnum(SchoolAttachmentTypeEnum)
  @Field(type => SchoolAttachmentTypeEnum)
  type: SchoolAttachmentTypeEnum;

  @IsUUID('4')
  @Field(type => ID)
  id: string;
}
@InputType()
export class CompleteRegistrationAsSchool {
  @ArrayMaxSize(getValuesFromEnum(EducationalGradesEnum).length)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ArrayUnique()
  @Field(type => [EducationalGradesEnum])
  grades: EducationalGradesEnum[];

  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', {
    each: true
  })
  @Field(type => [ID])
  curriculums: string[];

  @IsEnum(SchoolGenderEnum)
  @Field(type => SchoolGenderEnum)
  gender: SchoolGenderEnum;

  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', {
    each: true
  })
  @Field(type => [ID])
  certificates: string[];

  @IsLongitude()
  @IsNotEmpty()
  @Field(type => Float)
  long: number;

  @IsLatitude()
  @IsNotEmpty()
  @Field(type => Float)
  lat: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  arAddress?: string;

  @IsOptional()
  @IsString()
  @Field({nullable: true})
  enAddress?: string;
}
