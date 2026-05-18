import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(dto: CreateInquiryDto) {
    const { architectSlug, ...rest } = dto;
    let architectId: string | null = null;
    let architectEmail: string | null = null;
    let architectName: string | null = null;

    if (architectSlug) {
      const architect = await this.prisma.user.findUnique({
        where: { publicSlug: architectSlug },
        select: { id: true, email: true, inquiryEmail: true, name: true },
      });
      if (architect) {
        architectId = architect.id;
        // Ưu tiên inquiryEmail (chỗ nhận mail riêng), fallback email login
        architectEmail = architect.inquiryEmail || architect.email;
        architectName = architect.name;
      }
    }

    const inquiry = await this.prisma.inquiry.create({
      data: { ...rest, architectId: architectId ?? undefined },
    });

    this.mail
      .sendInquiryNotification(inquiry, { to: architectEmail, architectName })
      .catch(() => undefined);

    return { ok: true, id: inquiry.id };
  }

  async findAllForArchitect(architectId: string) {
    return this.prisma.inquiry.findMany({
      where: { architectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, architectId: string, status: InquiryStatus) {
    const existing = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!existing || existing.architectId !== architectId) throw new NotFoundException();
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }

  async remove(id: string, architectId: string) {
    const existing = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!existing || existing.architectId !== architectId) throw new NotFoundException();
    await this.prisma.inquiry.delete({ where: { id } });
    return { ok: true };
  }
}
