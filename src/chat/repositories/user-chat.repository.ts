import { Injectable } from '@nestjs/common';
import { UserChat } from '../models/user-chat.model';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';

@Injectable()
export class UserChatRepository {
  private readonly Model = UserChat;

  async inbox(ownerId: string) {
    return await this.Model.paginate({
      filter: {
        ownerId
      },
      include: [{ model: Chat, include: [Message] }]
    });
  }

  async rawDelete() {
    await this.Model.sequelize.query(`delete from "UserChats"`);
  }
}
