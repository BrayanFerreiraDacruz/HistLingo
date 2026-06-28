import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) throw new ConflictException('Email ou nome de usuário já em uso.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { username: dto.username, email: dto.email, password: hashed },
    });

    return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas.');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas.');

    return this.signToken(user.id, user.email);
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, username: true, email: true, role: true,
        xpTotal: true, level: true, streakCount: true,
        lastActivityDate: true, createdAt: true, avatarEmoji: true,
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'Se o email existir, você receberá as instruções em breve.' };

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });

    const baseUrl = process.env.FRONTEND_URL || 'https://grey-salamander-998398.hostingersite.com';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await this.sendResetEmail(user.email, user.username, resetUrl);

    return { message: 'Se o email existir, você receberá as instruções em breve.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
    });

    if (!user) throw new BadRequestException('Link de recuperação inválido ou expirado. Solicite um novo.');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, passwordResetToken: null, passwordResetExpires: null },
    });

    return { message: 'Senha atualizada com sucesso! Faça login.' };
  }

  private async sendResetEmail(to: string, username: string, resetUrl: string) {
    if (!process.env.SMTP_HOST) {
      console.log(`[HistLingo] Reset de senha para ${to}: ${resetUrl}`);
      return;
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"HistLingo" <noreply@histlingo.com>',
      to,
      subject: '🏹 HistLingo — Recuperação de Senha',
      html: `
        <div style="background:#0A1118;color:#fff;padding:40px;font-family:sans-serif;max-width:500px;margin:0 auto;border-radius:16px;">
          <h1 style="color:#00A651;">🏹 HistLingo</h1>
          <p>Olá, <strong>${username}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo:</p>
          <a href="${resetUrl}" style="display:inline-block;background:#00A651;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold;margin:20px 0;">
            REDEFINIR SENHA
          </a>
          <p style="color:#888;font-size:13px;">Este link expira em 1 hora. Se você não solicitou, ignore este email.</p>
        </div>
      `,
    });
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return { access_token: this.jwt.sign(payload) };
  }
}
