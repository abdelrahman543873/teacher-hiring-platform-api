import { UserRepository } from '../../src/user/repositories/user.repository';
import { UserChatRepository } from '../../src/chat/repositories/user-chat.repository';
import { ChatRepository } from '../../src/chat/repositories/chat.repository';
import { MessageRepository } from '../../src/chat/repositories/message.repository';

export async function rollbackDbForChat() {
  const userRepo = new UserRepository();
  const userChatRepo = new UserChatRepository();
  const chatRepo = new ChatRepository();
  const messageRepo = new MessageRepository();

  await userChatRepo.rawDelete();
  await messageRepo.rawDelete();
  await chatRepo.rawDelete();
  await userRepo.rawDelete();
}
