import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileRepository } from '../uploader/file.repository';
import { promises, existsSync } from 'fs';
import { Sequelize } from 'sequelize-typescript';
import { File } from '../uploader/file.model';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { differenceInHours } from 'date-fns';

@Injectable()
export class FilesReferencesChecking {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly fileRepo: FileRepository
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron(): Promise<void> {
    try {
      const files = await this.fileRepo.findFilesByFilter({ hasReferenceAtDatabase: false });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const absoluteDestination = `${process.cwd()}/public/${file.relativeDiskDestination}`;

        if (
          (!file.modelWhichUploadedFor || !file.modelWhichUploadedFor.modelId) &&
          differenceInHours(new Date(), new Date(file.createdAt)) >= 1
        ) {
          await this.checkFileExistenceThenDeleteAndUnlinkIt(file, absoluteDestination);
          continue;
        }

        if (!file.modelWhichUploadedFor || !file.modelWhichUploadedFor.modelId) continue;

        const model = this.sequelize.model(file.modelWhichUploadedFor.modelName);
        const dbRaw = await model.findByPk(file.modelWhichUploadedFor.modelId);

        if (!dbRaw) {
          await this.checkFileExistenceThenDeleteAndUnlinkIt(file, absoluteDestination);
          continue;
        }

        if (!this.hasFileReferenceAtDbModel(file, dbRaw)) {
          await this.checkFileExistenceThenDeleteAndUnlinkIt(file, absoluteDestination);
          continue;
        }

        await file.update({ hasReferenceAtDatabase: true });
      }
    } catch (error) {
      throw new BaseHttpException('EN', error.status || 500, error.message);
    }
  }

  private hasFileReferenceAtDbModel(file: File, dbRaw: unknown): boolean {
    const splittingModelDestination = file.modelWhichUploadedFor.modelDestination.split('_');
    const fieldValue = splittingModelDestination.reduce(
      (total, fieldKey) => (!total ? dbRaw[fieldKey] : total[fieldKey]),
      ''
    );
    if (Array.isArray(fieldValue)) return fieldValue.some((f: string) => f.includes(file.name));
    return fieldValue.includes(file.name);
  }

  private async checkFileExistenceThenDeleteAndUnlinkIt(file: File, destination: string) {
    existsSync(destination) && (await promises.unlink(destination));
    await file.destroy();
  }
}
