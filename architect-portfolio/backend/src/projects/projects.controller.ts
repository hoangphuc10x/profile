import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Get()
  listPublic() {
    return this.projects.findAllPublic();
  }

  @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.projects.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  listAll() {
    return this.projects.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  byId(@Param('id') id: string) {
    return this.projects.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projects.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projects.remove(id);
  }
}
