import { Injectable } from '@nestjs/common';
import { SchoolAdminRegistrationDetailsInput } from 'src/school/inputs/register-as-school-admin.input';
import { UserRoleEnum } from 'src/user/user.enum';
import { FileRepository } from 'src/_common/uploader/file.repository';
import { HelperService } from 'src/_common/utils/helper.service';
import { CompleteRegistrationAsSchool } from './inputs/complete-reg-as-school-admin';

@Injectable()
export class SchoolTransformer {
  constructor(
    private readonly helperService: HelperService,
    private readonly fileRepository: FileRepository
  ) {}

  async transformSchoolAdminForSignUp(admin: SchoolAdminRegistrationDetailsInput): Promise<Record<string, any>> {
    return {
      ...admin,
      phone: null,
      unverifiedPhone: admin.phone,
      slug: this.helperService.slugify(`${admin.firstName}${admin.lastName || ''}`),
      role: UserRoleEnum.SCHOOLADMIN,
      password: await this.helperService.hashPassword(admin.password)
    };
  }

  async transformCompleteSchoolRegistration(
    input: CompleteRegistrationAsSchool
  ): Promise<Record<string, any>> {
    return {
      ...input,
      certificates: await this.fileRepository
        .getPathsForFileIds(input.certificates)
        .then(files => files.map(({ relativeDiskDestination }) => relativeDiskDestination)),
      location: { type: 'Point', coordinates: [input.long, input.lat] }
    };
  }

  mapEachCurriculumTOSchoolId(schoolId: string, curriculumsIds: string[]) {
    return curriculumsIds.map(curriculumId => ({ schoolId, curriculumId }));
  }

 
}
