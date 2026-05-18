import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  // Public
  @Get()
  listPublic() {
    return this.projects.findAllPublic();
  }

  @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.projects.findBySlug(slug);
  }

  // Admin — chỉ thấy dự án của chính mình
  @UseGuards(JwtAuthGuard)
  @Get('admin/mine')
  listMine(@Req() req: any) {
    return this.projects.findAllByAuthor(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  byId(@Param('id') id: string, @Req() req: any) {
    return this.projects.findByIdForAuthor(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.projects.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Req() req: any) {
    return this.projects.update(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.projects.remove(id, req.user.userId);
  }
}
