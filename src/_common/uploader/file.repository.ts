import { Injectable } from '@nestjs/common';
import { Includeable, Op, Transaction, UpdateOptions, WhereOptions } from 'sequelize';
import { File } from './file.model';

@Injectable()
export class FileRepository {
  async findFileByFilter(where: WhereOptions = {}, include: Includeable[] = []) {
    return await File.findOne({ where, include });
  }

  async findFilesByFilter(where: WhereOptions = {}, include: Includeable[] = []) {
    return await File.findAll({ where, include });
  }

  async createFile(input = {}, include: Includeable[] = [], transaction?: Transaction) {
    return await File.create(input, { include, ...(transaction && { transaction }) });
  }

  async createFiles(models: {}[]) {
    return await File.bulkCreate(models);
  }

  async updateFileFromExistingModel(file: File, input = {}, transaction?: Transaction) {
    await file.update(input, { ...(transaction && { transaction }) });
    return file;
  }

  async deleteFile(fileId: string) {
    return await File.destroy({ where: { id: fileId } });
  }

  async truncateFileModel() {
    return await File.truncate({ force: true, cascade: true });
  }

  async countFilesByIdAndNameAndReferenceAndUploder({
    ids,
    modelName,
    uploadedById,
    hasReferenceAtDatabase
  }: {
    ids: string[];
    modelName: string;
    uploadedById: string;
    hasReferenceAtDatabase: boolean;
  }) {
    return await File.count({
      where: {
        id: {
          [Op.in]: ids
        },
        'modelWhichUploadedFor.modelName': {
          [Op.eq]: modelName
        },
        hasReferenceAtDatabase,
        uploadedById
      }
    });
  }

  async getPathsForFileIds(ids: string[]) {
    return await File.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      },
      attributes: ['relativeDiskDestination']
    });
  }

  async updateFiles(values: Record<string, any>, input: UpdateOptions) {
    return await File.update(values, input);
  }
}
