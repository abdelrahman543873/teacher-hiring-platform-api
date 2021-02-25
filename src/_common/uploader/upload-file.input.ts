import { Field, ArgsType } from '@nestjs/graphql';
import { ModelWhichUploadedFor, Upload, UploadedFile } from './uploader.type';
import { UploadScalar } from './uploader.scalar';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { FileModelEnum } from './uploader.enum';

@ArgsType()
export class UploadFileInput {
  @Exclude()
  @Field(type => UploadScalar)
  file: Upload | string;

  @IsNotEmpty()
  @Field(type => FileModelEnum)
  model: FileModelEnum;
}

export class FileHandlingInput {
  file: Upload | string | UploadedFile;

  saveTo: FileModelEnum;

  modelWhichUploadedFor?: ModelWhichUploadedFor;

  oldFile?: string;
}
