import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Subject } from './models/subject.model';

export const GqlSubjectResponse = generateGqlResponseType(Subject);
export const GqlSubjectsResponse = generateGqlResponseType(Array(Subject), true);
