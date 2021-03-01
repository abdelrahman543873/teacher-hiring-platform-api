import { Inject, Injectable } from '@nestjs/common';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatRepository } from './repositories/chat.repository';
import { CONTEXT } from '@nestjs/graphql';
import { GqlContext } from '../../dist/src/_common/graphql/graphql-context.type';
import { MessageRepository } from './repositories/message.repository';
import { UserChatRepository } from './repositories/user-chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userChatRepository: UserChatRepository,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async inbox() {
    return await this.userChatRepository.inbox(this.context.currentUser.id);
  }
  async sendMessage(input: SendMessageInput) {
    return await this.messageRepository.sendMessage(input);
  }
}
