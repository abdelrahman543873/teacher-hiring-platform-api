import { SetMetadata } from '@nestjs/common';
import { StatusEnum } from 'src/user/user.enum';

export const HasPermission = (...args: string[]) => SetMetadata('permissions', args);
export const HasRoles = (...args: string[]) => SetMetadata('roles', args);
export const HasStatus = (...args: StatusEnum[]) => SetMetadata('status', args);
