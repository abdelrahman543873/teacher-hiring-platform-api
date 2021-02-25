import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { UploadFileInput } from './upload-file.input';
import { UploaderService } from './uploader.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GqlFileResponse } from './uploader.response';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UploaderResolver {
  constructor(private readonly uploadService: UploaderService) {}

  @UseGuards(AuthGuard) // Auth for upload (STOP IT BECAUSE OF REGISTRATION)
  @Mutation(returns => GqlFileResponse)
  async uploadFile(@Args() input: UploadFileInput) {
    return await this.uploadService.graphqlUpload({
      file: input.file,
      saveTo: input.model,
      modelWhichUploadedFor: { modelName: input.model }
    });
  }
}
