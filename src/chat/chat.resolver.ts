import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { SendMessageInput } from './inputs/send-message.input';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GqlMessagesResponse } from './chat.response';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}
  /***********************************Queries****************************************/
  @UseGuards(AuthGuard)
  @Query(GqlMessagesResponse)
  async inbox() {
    return await this.chatService.inbox();
  }
  /***********************************Mutations****************************************/
  @UseGuards(AuthGuard)
  @Mutation()
  async sendMessage(@Args('input') input: SendMessageInput) {
    return await this.chatService.sendMessage(input);
  }
}
