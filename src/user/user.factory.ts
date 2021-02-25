import * as bcrypt from 'bcryptjs';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import { env } from 'src/_common/utils/env';
import { HelperService } from 'src/_common/utils/helper.service';
import { User } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { GenderEnum, LangEnum, UserRoleEnum, StatusEnum, CitiesEnum } from './user.enum';
import { LocationType, FcmTokensType, LastLoginDetails } from './user.type';
import { SUPER_ADMIN_GROUP } from '../../test/constants';
import { SecurityGroupFactory } from '../security-group/security-group.factory';
import { getAllPermissions } from '../security-group/security-group-permissions';
import { getValuesFromEnum } from '../_common/utils/columnEnum';

const helperService = new HelperService();
const userRepo = new UserRepository();
const isNullORValue = val => val === null || val;

type UserType = {
  firstName: string;
  lastName: string;
  slug: string;
  rejectionReasons?: string[];
  email: string;
  status: StatusEnum;
  isEmailVerified: boolean;
  isCompleted: boolean;
  phone: string;
  unverifiedPhone?: string;
  password: string;
  gender: GenderEnum;
  birthDate?: Date;
  role: UserRoleEnum;
  city: CitiesEnum;
  location: LocationType;
  profilePicture?: string;
  isBlocked: boolean;
  favLang: LangEnum;
  securityGroupId?: string;
  fcmTokens?: FcmTokensType;
  lastLoginDetails: LastLoginDetails;
};

function buildParams(obj = <any>{}): UserType {
  const firstName = obj.firstName || faker.name.title();
  return {
    firstName,
    lastName: obj.lastName || faker.name.title(),
    slug: helperService.slugify(firstName),
    rejectionReasons: obj.rejectionReasons || [],
    email: obj.email || faker.internet.email(),
    password: obj.password ? bcrypt.hashSync(obj.password, 12) : bcrypt.hashSync('123456', 12),
    gender: obj.gender || faker.random.arrayElement(['MALE', 'FEMALE']),
    role: obj.role || faker.random.arrayElement(['SCHOOLADMIN', 'TEACHER']),
    phone: isNullORValue(obj.phone)
      ? obj.phone
      : faker.phone.phoneNumber(`+20${faker.random.arrayElement([11, 12, 10])}########`),
    unverifiedPhone: isNullORValue(obj.unverifiedPhone)
      ? obj.unverifiedPhone
      : faker.phone.phoneNumber(`+20${faker.random.arrayElement([11, 12, 10])}########`),
    birthDate: obj.birthDate || faker.date.past(30).valueOf(),
    location: obj.location || {
      type: 'Point',
      coordinates: [faker.address.longitude, faker.address.latitude]
    },
    profilePicture: obj.profilePicture || faker.internet.avatar(),
    isBlocked: obj.isBlocked !== undefined ? obj.isBlocked : faker.random.boolean(),
    isCompleted: obj.isCompleted !== undefined ? obj.isCompleted : faker.random.boolean(),
    city: obj.city || faker.random.arrayElement(getValuesFromEnum(CitiesEnum)),
    status: obj.status || faker.random.arrayElement(getValuesFromEnum(StatusEnum)),
    favLang: obj.favLang || faker.random.arrayElement(['EN', 'AR']),
    fcmTokens: obj.fcmTokens || { android: null, ios: null, desktop: null },
    isEmailVerified:
      obj.isEmailVerified !== undefined ? obj.isEmailVerified : faker.random.boolean(),
    lastLoginDetails: obj.lastLoginDetails || null,
    securityGroupId: obj.securityGroupId
  };
}

export const UsersFactory = async (count = 10, obj = <any>{}): Promise<User[]> => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(buildParams(obj));
  }
  return await userRepo.createUsers(users);
};

export const UserFactory = async ({
  paramsOnly = false,
  obj = <any>{}
}): Promise<User | UserType> => {
  const params = buildParams(obj);
  if (paramsOnly) return params;
  const user = await userRepo.createUser({ values: params });
  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
  user.token = token;
  user.fcmTokens = { android: token };
  return user;
};

export const AdminUserFactory = async (obj = <any>{}): Promise<User> => {
  const adminRole = await SecurityGroupFactory({
    obj: {
      groupName: SUPER_ADMIN_GROUP,
      permissions: getAllPermissions()
    }
  });
  obj.securityGroupId = adminRole.id;
  const params = buildParams(obj);
  const user = await userRepo.createUser({ values: params });
  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET);
  user.token = token;
  user.fcmTokens = { android: token, ios: token, desktop: token };
  await user.save();
  return user;
};
