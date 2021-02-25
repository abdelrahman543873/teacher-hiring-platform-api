import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Curriculum } from './models/curriculum.model';

export const GqlCurriclumResponse = generateGqlResponseType(Curriculum);
export const GqlCurriclumsResponse = generateGqlResponseType(Array(Curriculum), true);
