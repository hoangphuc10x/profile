import { Controller, Get, Param } from '@nestjs/common';
import { ArchitectsService } from './architects.service';

@Controller('architects')
export class ArchitectsController {
  constructor(private readonly architects: ArchitectsService) {}

  @Get()
  list() {
    return this.architects.findAll();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.architects.findBySlug(slug);
  }
}
