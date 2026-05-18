import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.identifier, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() body: any) {
    const { name, phone, bio, tagline, avatarUrl, coverImage, coverPositionY, inquiryEmail } = body;
    return this.authService.updateProfile(req.user.userId, {
      name,
      phone,
      bio,
      tagline,
      avatarUrl,
      coverImage,
      coverPositionY,
      inquiryEmail,
    });
  }
}
