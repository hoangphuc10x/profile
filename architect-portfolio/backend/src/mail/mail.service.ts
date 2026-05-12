import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    if (!host) {
      this.logger.warn('SMTP_HOST not set — mail will be logged to console only.');
      return;
    }
    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
  }

  async sendInquiryNotification(inquiry: {
    customerName: string;
    phone: string;
    email?: string | null;
    areaRequest?: number | null;
    budgetRange?: string | null;
    message?: string | null;
  }) {
    const to = process.env.MAIL_TO || process.env.SMTP_USER;
    if (!to) {
      this.logger.warn('MAIL_TO not set — skipping email.');
      return;
    }

    const subject = `[Yêu cầu mới] ${inquiry.customerName} - ${inquiry.phone}`;
    const html = `
      <h2>Yêu cầu liên hệ mới</h2>
      <p><strong>Tên:</strong> ${escape(inquiry.customerName)}</p>
      <p><strong>Số điện thoại:</strong> ${escape(inquiry.phone)}</p>
      ${inquiry.email ? `<p><strong>Email:</strong> ${escape(inquiry.email)}</p>` : ''}
      ${inquiry.areaRequest ? `<p><strong>Diện tích yêu cầu:</strong> ${inquiry.areaRequest} m²</p>` : ''}
      ${inquiry.budgetRange ? `<p><strong>Ngân sách:</strong> ${escape(inquiry.budgetRange)}</p>` : ''}
      ${inquiry.message ? `<p><strong>Nội dung:</strong><br/>${escape(inquiry.message).replace(/\n/g, '<br/>')}</p>` : ''}
    `;

    if (!this.transporter) {
      this.logger.log(`[MAIL fallback] To: ${to}\nSubject: ${subject}\n${html}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      });
      this.logger.log(`Sent inquiry notification to ${to}`);
    } catch (err) {
      this.logger.error('Failed to send email', err as Error);
    }
  }
}

function escape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
