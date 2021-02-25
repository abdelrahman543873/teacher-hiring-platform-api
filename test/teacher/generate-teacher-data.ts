import { SchoolFactory } from 'src/school/school.factory';
import { TeacherFactory } from 'src/teacher/teacher.factory';
import { User } from 'src/user/models/user.model';
import { UserFactory } from 'src/user/user.factory';
import * as cites from '../eg-cities.json';
import * as faker from 'faker';
import { UserRoleEnum } from 'src/user/user.enum';
import { ArrayOFCitesClosestToDamietta } from '../constants';

export async function generateTeacherData({
  user = {},
  teacher = {}
}: {
  user: Record<string, any>;
  teacher: Record<string, any>;
}) {
  const createdUser = (await UserFactory({ paramsOnly: false, obj: user })) as User;
  const createdTeacher = await TeacherFactory({ ...teacher, teacherId: createdUser.id });
  return { user: createdUser, teacher: createdTeacher };
}

export async function generateTeachersWithOrderedCities({
  user = {},
  teacher = {},
  count = 0
}: {
  user?: Record<string, any>;
  teacher?: Record<string, any>;
  count?: number;
}) {
  const locationArray = ArrayOFCitesClosestToDamietta.map(({ lat, lng }) => ({
    type: 'Point',
    coordinates: [lng, lat]
  }));
  const teachers = [];
  for (let i = 0; i < ArrayOFCitesClosestToDamietta.length; i++) {
    const createdTeacher = await generateTeacherData({
      user: {
        ...user,
        role: UserRoleEnum.TEACHER,
        location: locationArray[i],
        lastName: cites.find(
          c =>
            c.lat === locationArray[i].coordinates[1] && c.lng === locationArray[i].coordinates[0]
        ).city
      },
      teacher
    });
    teachers.push(createdTeacher);
  }
  return teachers;
}
