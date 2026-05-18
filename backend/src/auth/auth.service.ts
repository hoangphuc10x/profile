import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const id = identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: id }, { username: id }] },
    });
    if (!user) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        publicSlug: user.publicSlug,
        name: user.name,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  async updateProfile(
    userId: string,
    data: Partial<{
      name: string;
      phone: string;
      bio: string;
      tagline: string;
      avatarUrl: string;
      coverImage: string;
      coverPositionY: number;
      inquiryEmail: string;
    }>,
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }
}
