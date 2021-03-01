import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { ChatRepository } from './repositories/chat.repository';

@Module({
  providers: [ChatService, ChatResolver, ChatRepository]
})
export class ChatModule {}
