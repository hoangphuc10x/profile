import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }

  async findAllByAuthor(authorId: string) {
    return this.prisma.project.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!project || !project.published) throw new NotFoundException('Không tìm thấy dự án');
    return project;
  }

  async findByIdForAuthor(id: string, authorId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!project) throw new NotFoundException('Không tìm thấy dự án');
    if (project.authorId !== authorId) {
      throw new ForbiddenException('Bạn không có quyền với dự án này');
    }
    return project;
  }

  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const base = slugify(title) || 'du-an';
    let slug = base;
    let n = 1;
    while (true) {
      const existing = await this.prisma.project.findUnique({ where: { slug } });
      if (!existing || existing.id === excludeId) return slug;
      n += 1;
      slug = `${base}-${n}`;
    }
  }

  async create(authorId: string, dto: CreateProjectDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    const { images, ...rest } = dto;
    return this.prisma.project.create({
      data: {
        ...rest,
        slug,
        authorId,
        images:
          images && images.length
            ? { create: images.map((url, order) => ({ url, order })) }
            : undefined,
      },
      include: { images: true },
    });
  }

  async update(id: string, authorId: string, dto: UpdateProjectDto) {
    const existing = await this.findByIdForAuthor(id, authorId);
    const slug = dto.title ? await this.generateUniqueSlug(dto.title, id) : existing.slug;
    const { images, ...rest } = dto;

    if (images) {
      await this.prisma.projectImage.deleteMany({ where: { projectId: id } });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        slug,
        images: images ? { create: images.map((url, order) => ({ url, order })) } : undefined,
      },
      include: { images: true },
    });
  }

  async remove(id: string, authorId: string) {
    await this.findByIdForAuthor(id, authorId);
    await this.prisma.project.delete({ where: { id } });
    return { ok: true };
  }
}
