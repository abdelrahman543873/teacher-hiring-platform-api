import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Teacher } from './models/teacher.model';

export const GqlTeacherResponse = generateGqlResponseType(Teacher);
export const GqlTeacheresResponse = generateGqlResponseType(Array(Teacher));
