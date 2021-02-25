export enum UserPermissionsEnum {
  READ_USERS = 'READ_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  CREATE_USERS = 'CREATE_USERS',
  DELETE_USERS = 'DELETE_USERS'
}

export enum SecurityGroupPermissionsEnum {
  READ_ROLES = 'READ_ROLES',
  UPDATE_ROLES = 'UPDATE_ROLES',
  CREATE_ROLES = 'CREATE_ROLES',
  DELETE_ROLES = 'DELETE_ROLES',
  ASSIGN_ROLES_TO_USERS = 'ASSIGN_ROLES_TO_USERS'
}

export enum NotificationPermissionsEnum {
  SEND_NOTIFICATIONS = 'SEND_NOTIFICATIONS'
}

export enum AppConfigurationPermissionsEnum {
  READ_APP_CONFIGURATION = 'READ_APP_CONFIGURATION',
  UPDATE_APP_CONFIGURATION = 'UPDATE_APP_CONFIGURATION',
  CREATE_APP_CONFIGURATION = 'CREATE_APP_CONFIGURATION'
}

export enum CurriculumPermissionsEnum {
  READ_CURRICULUMS = 'READ_CURRICULUMS',
  UPDATE_CURRICULUM = 'UPDATE_CURRICULUM',
  CREATE_CURRICULUM = 'CREATE_CURRICULUM',
  DELETE_CURRICULUM = 'DELETE_CURRICULUM'
}

export enum SubjectPermissionsEnum {
  READ_SUBJECTS = 'READ_SUBJECTS',
  UPDATE_SUBJECTS = 'UPDATE_SUBJECTS',
  CREATE_SUBJECTS = 'CREATE_SUBJECTS',
  DELETE_SUBJECTS = 'DELETE_SUBJECTS'
}

export const permissions = {
  users: Object.keys(UserPermissionsEnum),
  roles: Object.keys(SecurityGroupPermissionsEnum),
  notifications: Object.keys(NotificationPermissionsEnum),
  appConfiguration: Object.keys(AppConfigurationPermissionsEnum),
  curriculumPermissions: Object.keys(CurriculumPermissionsEnum),
  subjectPermissions: Object.keys(SubjectPermissionsEnum)
};

export function getAllPermissions(): string[] {
  return Object.values(permissions).reduce((total, row) => {
    total.push(...row);
    return total;
  }, []);
}
