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
    const inquiry = await this.prisma.inquiry.create({ data: dto });
    this.mail.sendInquiryNotification(inquiry).catch(() => undefined);
    return { ok: true, id: inquiry.id };
  }

  async findAll() {
    return this.prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, status: InquiryStatus) {
    const existing = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException();
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.prisma.inquiry.delete({ where: { id } });
    return { ok: true };
  }
}
