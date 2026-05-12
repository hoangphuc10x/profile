import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');

@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const id = crypto.randomBytes(8).toString('hex');
          cb(null, `${Date.now()}-${id}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh') as any, false);
        }
        cb(null, true);
      },
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('Không có file nào');
    return {
      urls: files.map((f) => `/uploads/${f.filename}`),
    };
  }
}
