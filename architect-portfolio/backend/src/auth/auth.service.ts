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

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async updateProfile(userId: string, data: Partial<{ name: string; phone: string; bio: string; avatarUrl: string }>) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
