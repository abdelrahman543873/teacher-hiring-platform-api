import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UploadScalar } from './uploader.scalar';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';
import { restUploaderMiddleware } from './uploader.middleware';
import { UploaderResolver } from './uploader.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { FileRepository } from './file.repository';

@Module({
  imports: [AuthModule],
  controllers: [UploaderController],
  providers: [UploadScalar, UploaderService, UploaderResolver, FileRepository],
  exports: [UploadScalar, UploaderService, FileRepository]
})
export class UploaderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(restUploaderMiddleware).forRoutes(UploaderController);
  }
}
