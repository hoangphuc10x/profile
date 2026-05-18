import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArchitectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { publicSlug: { not: null } },
      select: {
        id: true,
        name: true,
        publicSlug: true,
        avatarUrl: true,
        tagline: true,
        bio: true,
        _count: { select: { projects: true } },
      },
      orderBy: { name: 'asc' },
    });
    return users.map(({ _count, ...rest }) => ({
      ...rest,
      projectCount: _count.projects,
    }));
  }

  async findBySlug(slug: string) {
    const user = await this.prisma.user.findUnique({
      where: { publicSlug: slug },
      select: {
        id: true,
        name: true,
        publicSlug: true,
        avatarUrl: true,
        coverImage: true,
        coverPositionY: true,
        tagline: true,
        bio: true,
        phone: true,
        email: true,
        projects: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
          include: { images: { orderBy: { order: 'asc' } } },
        },
      },
    });
    if (!user) throw new NotFoundException('Không tìm thấy kiến trúc sư');
    return user;
  }
}
