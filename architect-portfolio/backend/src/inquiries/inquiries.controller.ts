import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiries: InquiriesService) {}

  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list() {
    return this.inquiries.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: InquiryStatus) {
    return this.inquiries.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiries.remove(id);
  }
}
