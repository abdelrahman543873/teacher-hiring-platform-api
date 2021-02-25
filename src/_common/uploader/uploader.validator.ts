import { Injectable } from '@nestjs/common';
import { FileRepository } from './file.repository';

@Injectable()
export class UploaderValidator {
  constructor(private readonly fileRepository: FileRepository) {}

  async checkFileIdsExist(ids: string[], modelName: string) {
    const count = await this.fileRepository.findFileByFilter({});
  }
}
