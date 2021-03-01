import { Injectable } from '@nestjs/common';
import { SendMessageInput } from '../inputs/send-message.input';
import { Message } from '../models/message.model';

@Injectable()
export class MessageRepository {
  private readonly Model = Message;
  async sendMessage(input: SendMessageInput) {
    return await this.Model.create({ ...input });
  }

  async rawDelete() {
    await this.Model.sequelize.query(`delete from "Messages"`);
  }
}
