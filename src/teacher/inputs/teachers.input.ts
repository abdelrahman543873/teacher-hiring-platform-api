import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { SearchByUserGenderEnum } from 'src/user/user.enum';
import { IsCity } from 'src/_common/custom-validator/isCity';
import { PaginatorInput } from 'src/_common/paginator/paginator.input';
import { getValuesFromEnum } from 'src/_common/utils/columnEnum';
import { EducationalGradesEnum } from '../teacher.enums';

@InputType()
export class TeachersFiltersByInput {
  @IsOptional()
  @ArrayUnique()
  @IsUUID('4', {
    each: true
  })
  @Field(type => [ID], { nullable: 'itemsAndList' })
  subjects?: [];

  @IsOptional()
  @ArrayMaxSize(getValuesFromEnum(EducationalGradesEnum).length)
  @ArrayUnique()
  @Field(type => [EducationalGradesEnum], { nullable: 'itemsAndList' })
  grades?: EducationalGradesEnum[];

  @IsOptional()
  @ArrayUnique()
  @IsUUID('4', {
    each: true
  })
  @Field(type => [ID], { nullable: 'itemsAndList' })
  curriculums?: [];

  @IsOptional()
  @IsEnum(SearchByUserGenderEnum)
  @Field(type => SearchByUserGenderEnum, { nullable: true })
  gender?: SearchByUserGenderEnum;

  @IsOptional()
  @Min(0)
  @Max(5)
  @IsNumber()
  @Field(type => Float, { nullable: true })
  rating?: number;

  @IsOptional()
  @Min(0)
  @Max(50)
  @IsNumber()
  @Field(type => Float, { nullable: true })
  minExperience?: number;

  @IsOptional()
  @Min(0)
  @Max(50)
  @IsNumber()
  @Field(type => Float, { nullable: true })
  maxExperience?: number;

  @IsOptional()
  @IsCity({ each: true })
  @Field(type => [String], { nullable: 'itemsAndList' })
  cities?: [];

  @IsOptional()
  @Field({
    nullable: true,
    description:
      'if it used with lat and long it will take it as starting point if lat and long not provided it will take school admin location instead.the distance in km'
  })
  max_distance?: number;
}

@InputType({
  description:
    'this is query works for both list and map filter if you search with map provide both lat and long '
})
export class GetTeachersInput extends PaginatorInput {
  @IsOptional()
  @ValidateNested()
  @Type(() => TeachersFiltersByInput)
  @Field(type => TeachersFiltersByInput, { nullable: true })
  filterBy?: TeachersFiltersByInput;

  @IsOptional()
  @Field({
    nullable: true,
    description: 'this search key for search for teachers with their first and last name only'
  })
  searchKey?: string;

  @ValidateIf(o => o.long)
  @IsLatitude()
  @Field({
    nullable: true,
    description:
      'this is lat of point you might provide it if you search in the map to get closer result of the point'
  })
  lat?: number;

  @ValidateIf(o => o.lat)
  @IsLongitude()
  @Field({
    nullable: true,
    description:
      'this is long of point you might provide it if you search in the map to get closer result of the point'
  })
  long?: number;
}
