import { generateGqlResponseType } from 'src/_common/graphql/graphql-response.type';
import { Message } from './models/message.model';

export const GqlMessageResponse = generateGqlResponseType(Message);
export const GqlMessagesResponse = generateGqlResponseType(Array(Message));
