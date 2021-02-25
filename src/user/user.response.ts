import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { User } from './models/user.model';

export const GqlUserResponse = generateGqlResponseType(User);
export const GqlUsersResponse = generateGqlResponseType(Array(User));
export const GqlCitiesResponse = generateGqlResponseType(Array(String), true);
export const GqlUsersArrayResponse = generateGqlResponseType(Array(User), true);
