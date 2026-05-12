import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.env.UPLOAD_DIR || './uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    ProjectsModule,
    InquiriesModule,
    UploadModule,
  ],
})
export class AppModule {}
