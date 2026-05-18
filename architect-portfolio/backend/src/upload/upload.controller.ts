import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) {
          return cb(new BadRequestException('Chỉ chấp nhận file ảnh') as any, false);
        }
        cb(null, true);
      },
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('Không có file nào');

    const results = await Promise.all(files.map((f) => this.cloudinary.uploadBuffer(f.buffer)));

    return {
      urls: results.map((r) => r.secure_url),
      // public_id lưu lại để có thể delete sau này
      publicIds: results.map((r) => r.public_id),
    };
  }
}
