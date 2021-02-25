import { Controller, Post, UploadedFiles, Res, Body, Req } from '@nestjs/common';
import { UploadedFile } from './uploader.type';
import { UploaderService } from './uploader.service';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly authService: AuthService
  ) {}

  //@Post('upload')
  // async uploadFile(@UploadedFiles() files: UploadedFile[], @Body() body, @Res() res, @Req() req) {
  //   try {
  //     // Model is required
  //     if (!body || !body.model)
  //       return res.json({
  //         message: 'You have to provide the `model` field',
  //         code: 637,
  //         success: false
  //       });

  //     // Auth for upload
  //     let user = await this.authService.getUserFromReqHeaders(req);
  //     if (!user || user.isBlocked)
  //       return res.json({
  //         message: 'You do not have permissions to upload this files',
  //         code: 637,
  //         success: false
  //       });

  //     // Upload process
  //     if (!files || !files.length)
  //       return res.json({
  //         message: 'No files',
  //         code: 637,
  //         success: false
  //       });

  //     let images = [];
  //     for (let i = 0; i < files.length; i++) {
  //       let imageName = await this.uploaderService.restUpload({
  //         file: files[i],
  //         saveTo: body.model,
  //         modelWhichUploadedFor: body.modelWhichUploadedFor
  //       });
  //       images.push(imageName);
  //     }

  //     // Return uploaded files
  //     return res.json({
  //       success: true,
  //       statusCode: 200,
  //       message: 'Files uploaded successfully',
  //       data: images
  //     });
  //   } catch (error) {
  //     return res.json({
  //       message: error.message,
  //       code: 637,
  //       success: false
  //     });
  //   }
}
