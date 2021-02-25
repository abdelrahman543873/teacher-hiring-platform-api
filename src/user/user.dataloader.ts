import { School } from 'src/school/models/school.model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as DataLoader from 'dataloader';
import { SchoolRepository } from 'src/school/school.repository';
import { Teacher } from 'src/teacher/models/teacher.model';
import { UserRepository } from './repositories/user.repository';
import { User } from './models/user.model';

@Injectable({})
export class UserDataLoader implements OnModuleInit {
  private schoolRepository: SchoolRepository;
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly userRepository: UserRepository
  ) {}
  onModuleInit() {
    this.schoolRepository = this.moduleRef.get(SchoolRepository, { strict: false });
  }
  get isCompleteTeacherLoader() {
    return new DataLoader(async (usersIds: string[]) => {
      const foundTeachers = await Teacher.findAll({
        where: {
          teacherId: usersIds
        },
        attributes: ['teacherId'],
        raw: true
      });
      return usersIds.map(userId => foundTeachers.some(teacher => teacher.teacherId === userId));
    });
  }
  get isCompleteSchoolLoader() {
    return new DataLoader(async (usersIds: string[]) => {
      const foundSchools = await School.findAll({
        where: {
          schoolAdminId: usersIds
        },
        attributes: ['schoolAdminId', 'grades'],
        raw: true
      });
      return usersIds.map(userId =>
        foundSchools.some(school => school.schoolAdminId === userId && !!school?.grades?.length)
      );
    });
  }
  get schoolsLoader() {
    return new DataLoader(async (usersIds: string[]) => {
      const foundSchools = await this.schoolRepository.findSchoolsByAdminIds(usersIds);
      return usersIds.map(userId => foundSchools.find(school => school.schoolAdminId === userId));
    });
  }
  awayFromCurrentUserLoaderBy(currentUser: User) {
    return new DataLoader(async (usersIds: string[]) => {
      if (!currentUser || !currentUser?.location) {
        return null;
      }
      const [long, lat] = currentUser.location.coordinates;
      const usersDistances = await this.userRepository.getDistanceBetweenEachUserAndPoint(
        usersIds,
        {
          long,
          lat
        }
      );
      return usersIds.map(userId => {
        return Number(usersDistances.find(user => user.id === userId).get('distance')) / 1000;
      });
    });
  }
}
