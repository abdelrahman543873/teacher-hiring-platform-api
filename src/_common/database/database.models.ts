import { AppConfiguration } from 'src/app-configuration/app-configuration.model';
import { SecurityGroup } from 'src/security-group/security-group.model';
import { User } from 'src/user/models/user.model';
import { UserVerificationCode } from 'src/user/models/user-verification-code.model';
import { NotificationUserStatus } from 'src/notification/models/notification-user-status.model';
import { Notification } from 'src/notification/models/notification.model';
import { Teacher } from '../../teacher/models/teacher.model';
import { School } from '../../school/models/school.model';
import { Curriculum } from '../../curriculum/models/curriculum.model';
import { SchoolCurriculum } from '../../curriculum/models/school-curriculum.model';
import { Subject } from '../../subject/models/subject.model';
import { TeacherSubject } from '../../subject/models/teacher-subject.model';
import { TeacherCurriculum } from '../../curriculum/models/teacher-curriculum.model';
import { File } from '../uploader/file.model';
import { Review } from 'src/review/review.model';
import { Chat } from '../../chat/models/chat.model';
import { Message } from '../../chat/models/message.model';
import { UserChat } from '../../chat/models/user-chat.model';

export const models = [
  User,
  Curriculum,
  SchoolCurriculum,
  UserVerificationCode,
  SecurityGroup,
  AppConfiguration,
  Notification,
  NotificationUserStatus,
  File,
  Teacher,
  School,
  Subject,
  TeacherSubject,
  TeacherCurriculum,
  Review,
  Chat,
  Message,
  UserChat
];
