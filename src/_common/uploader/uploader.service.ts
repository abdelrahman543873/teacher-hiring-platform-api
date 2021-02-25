import { Inject, Injectable } from '@nestjs/common';
import { createWriteStream, unlinkSync, existsSync, mkdirSync, writeFile, promises } from 'fs';
import { Upload, UploadedFile } from './uploader.type';
import { BaseHttpException } from '../exceptions/base-http-exception';
import { FileRepository } from './file.repository';
import { CONTEXT } from '@nestjs/graphql';
import { GqlContext } from '../graphql/graphql-context.type';
import { FileHandlingInput } from './upload-file.input';
import { File } from './file.model';

@Injectable()
export class UploaderService {
  constructor(
    private readonly fileRepo: FileRepository,
    @Inject(CONTEXT) private readonly context: GqlContext
  ) {}

  async graphqlUpload(input: FileHandlingInput): Promise<File> {
    try {
      const absoluteDiskDestination = `${process.cwd()}/public/${input.saveTo}`;
      // Delete the old file
      if (input.oldFile) {
        const filePath = `${absoluteDiskDestination}/${this.getFileNameFromUrl(input.oldFile)}`;
        if (existsSync(filePath)) this.deleteFile(filePath);
      }

      const { filename, createReadStream, mimetype, encoding } = await (<Promise<Upload>>(
        (<unknown>input.file)
      ));
      const name = `${Date.now()}-${filename}`;
      const relativeDiskDestination = `${input.saveTo}/${name}`;
      if (!existsSync(absoluteDiskDestination))
        mkdirSync(absoluteDiskDestination, { recursive: true });

      // Save the new file
      return new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(`${absoluteDiskDestination}/${name}`))
          .on('finish', async () => {
            const fileStat = await promises.stat(`${absoluteDiskDestination}/${name}`);
            const createdFile = await this.fileRepo.createFile({
              relativeDiskDestination,
              name,
              sizeInBytes: fileStat.size,
              hasReferenceAtDatabase: false,
              ...(encoding && { encoding }),
              ...(mimetype && { mimetype }),
              ...(input.modelWhichUploadedFor && {
                modelWhichUploadedFor: input.modelWhichUploadedFor
              }),
              ...(this.context.currentUser && { uploadedById: this.context.currentUser.id })
            });
            resolve(createdFile);
          })
          .on('error', () => reject(false));
      });
    } catch (e) {
      throw new BaseHttpException('EN', 500, e.message);
    }
  }

  // async restUpload(input: FileHandlingInput): Promise<string> {
  //   try {
  //     const absoluteDiskDestination = `${process.cwd()}/public/${input.saveTo}`;

  //     // Delete the old file
  //     if (input.oldFile) {
  //       const filePath = `${absoluteDiskDestination}/${this.getFileNameFromUrl(input.oldFile)}`;
  //       if (existsSync(filePath)) this.deleteFile(filePath);
  //     }

  //     if (typeof input.file === 'string') {
  //       return input.file;
  //     } else {
  //       const file = input.file as UploadedFile;
  //       const name = `${Date.now()}-${file.originalname}`;
  //       const relativeDiskDestination = `${input.saveTo}/${name}`;

  //       if (!existsSync(absoluteDiskDestination))
  //         mkdirSync(absoluteDiskDestination, { recursive: true });
  //       await this.asyncWrite(`${absoluteDiskDestination}/${name}`, file.buffer);

  //       const fileStat = await promises.stat(`${absoluteDiskDestination}/${name}`);
  //       await this.fileRepo.createFile({
  //         relativeDiskDestination,
  //         name,
  //         sizeInBytes: fileStat.size,
  //         hasReferenceAtDatabase: false,
  //         ...(file.mimetype && { mimetype: file.mimetype }),
  //         ...(input.modelWhichUploadedFor && {
  //           modelWhichUploadedFor: input.modelWhichUploadedFor
  //         }),
  //         ...(this.context.currentUser && { uploadedById: this.context.currentUser.id })
  //       });

  //       return relativeDiskDestination;
  //     }
  //   } catch (e) {
  //     throw new BaseHttpException('EN', 500, e.message);
  //   }
  // }

  public getFileNameFromUrl(url: string): string {
    return url.split('/').reverse()[0];
  }

  private deleteFile(file: string, saveTo?: string): void {
    let filePath = file;
    if (saveTo) filePath = `${process.cwd()}/public/${saveTo}/${this.getFileNameFromUrl(file)}`;
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  private asyncWrite(path: string, data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(path, data, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
