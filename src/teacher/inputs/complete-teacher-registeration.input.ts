import { Field, InputType, ID } from '@nestjs/graphql';
import { EducationalGradesEnum } from '../teacher.enums';
import { getValuesFromEnum } from '../../_common/utils/columnEnum';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique
} from 'class-validator';

@InputType()
export class CompleteTeacherRegisterationInput {
  @ArrayMaxSize(getValuesFromEnum(EducationalGradesEnum).length)
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ArrayUnique()
  @Field(() => [EducationalGradesEnum])
  grades: EducationalGradesEnum[];

  @ArrayMinSize(1)
  @IsNotEmpty()
  @Field(() => [String])
  subjects: string[];

  @ArrayMinSize(1)
  @IsNotEmpty()
  @Field(() => [String])
  curriculums: string[];

  @IsNotEmpty()
  @Field()
  experience: number;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  cv: string;

  @IsNotEmpty()
  @IsUUID()
  @Field()
  idDocument: string;

  @ArrayMinSize(1)
  @IsNotEmpty()
  @Field(() => [ID])
  certificates: string[];

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  arAddress?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  enAddress?: string;
}
