import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { SrsService } from '../srs/srs.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private gamification: GamificationService,
    private srs: SrsService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateStreak(id: string) {
    return this.gamification.updateStreak(id);
  }

  async updateProfile(userId: string, dto: { username?: string; avatarEmoji?: string }) {
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username, NOT: { id: userId } },
      });
      if (existing) throw new ConflictException('Nome de usuário já em uso.');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, username: true, xpTotal: true, level: true, streakCount: true, avatarEmoji: true, email: true },
    });
  }

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      select: { id: true, username: true, xpTotal: true, level: true, streakCount: true, avatarEmoji: true },
      orderBy: { xpTotal: 'desc' },
      take: 20,
    });
    return users.map((u, i) => ({ ...u, rank: i + 1, league: this.getLeague(u.xpTotal) }));
  }

  async getProgress(userId: string) {
    const progress = await this.prisma.userProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });
    return progress.map(p => p.lessonId);
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lição não encontrada.');

    const already = await this.prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    await this.prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true },
      create: { userId, lessonId, completed: true },
    });

    // Only grant XP on first completion
    if (!already?.completed) {
      await this.gamification.addXP(userId, lesson.xpReward);
      await this.gamification.updateStreak(userId);
      return { xpGained: lesson.xpReward, firstTime: true };
    }
    return { xpGained: 0, firstTime: false };
  }

  async submitAnswer(userId: string, challengeId: string, quality: number) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Desafio não encontrado.');

    const existingReview = await this.prisma.userReview.findFirst({ where: { userId, challengeId } });
    const srsData = this.srs.calculateNextReview(existingReview || {}, quality);

    if (existingReview) {
      await this.prisma.userReview.update({ where: { id: existingReview.id }, data: srsData });
    } else {
      await this.prisma.userReview.create({ data: { userId, challengeId, ...srsData } });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const xpGain = this.gamification.calculateXPGain(10, challenge.difficultyWeight, user.streakCount);
    await this.gamification.addXP(userId, xpGain);

    return { xpGain, nextReviewDate: srsData.nextReviewDate };
  }

  private getLeague(xp: number): string {
    if (xp >= 10000) return 'Mestre';
    if (xp >= 5000) return 'Diamante';
    if (xp >= 2000) return 'Ouro';
    if (xp >= 500) return 'Prata';
    return 'Bronze';
  }
}
