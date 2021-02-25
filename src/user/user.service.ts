import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CitiesEnum, UserRoleEnum } from './user.enum';
import { User } from './models/user.model';
import { UserDataLoader } from './user.dataloader';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userDataLoader: UserDataLoader
  ) {}

  cities() {
    const cities = [];
    for (const i in CitiesEnum) {
      cities.push(i);
    }
    return cities;
  }

  async findUser(id: string) {
    return await this.userRepo.findCurrentUserForContext(id);
  }

  async users() {
    return await this.userRepo.users();
  }

  async isComplete(user: User) {
    if (user.role === UserRoleEnum.TEACHER)
      return await this.userDataLoader.isCompleteTeacherLoader.load(user.id);
    return await this.userDataLoader.isCompleteSchoolLoader.load(user.id);
  }
}
