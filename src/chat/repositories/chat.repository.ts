import { Injectable } from '@nestjs/common';
import { Chat } from '../models/chat.model';

@Injectable()
export class ChatRepository {
  private readonly Model = Chat;

  async rawDelete() {
    await this.Model.sequelize.query(`delete from "Chats"`);
  }
}
