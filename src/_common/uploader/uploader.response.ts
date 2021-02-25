import { User } from 'src/user/models/user.model';
import { generateGqlResponseType } from '../graphql/graphql-response.type';
import { File } from './file.model';

export const GqlFileResponse = generateGqlResponseType(File);
