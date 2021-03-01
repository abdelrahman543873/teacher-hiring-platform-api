import * as faker from 'faker';
import { Chat } from '../models/chat.model';

type ChatType = {
  id: string;
};

export const buildChatParams = (obj = <any>{}): ChatType => {
  return {
    id: obj.id || faker.random.uuid()
  };
};

export const ChatsFactory = async (count = 10, obj = <any>{}): Promise<Chat[]> => {
  const chats = [];
  for (let i = 0; i < count; i++) {
    chats.push(buildChatParams(obj));
  }
  return await Chat.bulkCreate(chats);
};

export const ChatFactory = async (obj = <any>{}): Promise<Chat> => {
  const params = buildChatParams(obj);
  return await Chat.create(params);
};
