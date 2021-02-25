import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { School } from './models/school.model';

export const GqlSchoolResponse = generateGqlResponseType(School);
