import { Injectable } from '@nestjs/common';
import { GenderEnum, SearchByUserGenderEnum } from 'src/user/user.enum';
import { getValuesFromEnum } from 'src/_common/utils/columnEnum';
import { GetTeachersInput, TeachersFiltersByInput } from './inputs/teachers.input';

@Injectable()
export class TeacherTransformer {
  transformFilterByTeachersInput(input: TeachersFiltersByInput) {
    const transformedInput: Record<string, any> = {};
    const {
      gender,
      maxExperience,
      minExperience,
      cities,
      curriculums,
      grades,
      rating,
      subjects
    } = input;
    if (gender === SearchByUserGenderEnum.All) {
      transformedInput.gender = [SearchByUserGenderEnum.MALE, SearchByUserGenderEnum.FEMALE];
    } else if (gender) {
      transformedInput.gender = [gender];
    }
    if (grades) {
      transformedInput.grade = grades;
    }
    return {
      ...input,
      ...transformedInput
    };
  }

  mapEachCurriculumIdToTeacherId(teacherId: string, curriculumsIds): Record<string, string>[] {
    return curriculumsIds.map(curriculumId => ({ teacherId, curriculumId }));
  }
  mapEachSubjectIdToTeacherId(teacherId: string, subjectsIds: string[]): Record<string, string>[] {
    return subjectsIds.map(subjectId => ({ teacherId, subjectId }));
  }
}
