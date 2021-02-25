import * as faker from 'faker';
import { File } from './file.model';
import { FileRepository } from './file.repository';
import { ModelWhichUploadedFor } from './uploader.type';

type FileType = {
  relativeDiskDestination: string;

  name: string;

  encoding: string;

  mimetype: string;

  sizeInBytes: number;

  hasReferenceAtDatabase: boolean;

  modelWhichUploadedFor?: ModelWhichUploadedFor;

  uploadedById?: string;
};

function buildParams(obj: Record<string, any>): FileType {
  return {
    name: obj.name || faker.random.word(),
    encoding: obj.encoding || faker.random.word(),
    mimetype: obj.encoding || faker.system.mimeType(),
    sizeInBytes: obj.sizeInBytes || faker.random.number({ min: 1000, max: 5000000 }),
    hasReferenceAtDatabase:
      obj.hasReferenceAtDataBase !== undefined
        ? obj.hasReferenceAtDataBase
        : faker.random.boolean(),
    uploadedById: obj.userId || (obj.usersIds && faker.random.arrayElement(obj.usersIds)),
    modelWhichUploadedFor: obj.modelWhichUploadedFor || {
      modelDestination: faker.random.word()
    },
    relativeDiskDestination: obj.relativeDiskDestination || faker.system.filePath()
  };
}

const fileRepository = new FileRepository();

export async function FileFactory({
  obj = {},
  paramsOnly = false
}: {
  obj: Record<string, any>;
  paramsOnly: boolean;
}): Promise<FileType | File> {
  const file = buildParams(obj);
  if (paramsOnly) {
    return file;
  }
  return await fileRepository.createFile(file);
}

export async function FilesFactory(count = 10, obj = {}): Promise<File[]> {
  const files = [];
  for (let i = 0; i < count; i++) {
    const file = await buildParams(obj);
    files.push(file);
  }

  return await fileRepository.createFiles(files);
}
