import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UpdateUserStatusInput } from './inputs/update-user-status.input';
import { User } from '../user/models/user.model';
import { TeacherOrSchoolAdminEnum } from './user-updates.enum';
import { Op } from 'sequelize';
import { PaginatorInput } from 'src/_common/paginator/paginator.input';

@Injectable()
export class UserUpdatesRepository {
  constructor(private readonly userRepo: UserRepository) {}

  async updateUserStatus(updateUserStatus: UpdateUserStatusInput) {
    const updatedUser = await User.update(updateUserStatus, {
      where: { id: updateUserStatus.id },
      returning: true
    });
    return updatedUser[1][0];
  }

  async viewPaginatedRequestsByRole(
    role?: TeacherOrSchoolAdminEnum,
    sort: Record<string, any>[] = [],
    paginate: PaginatorInput = {}
  ) {
    return await User.paginate({
      filter: {
        ...(role && { role }),
        phone: { [Op.ne]: null }
      },
      ...paginate,
      sort
    });
  }
}
