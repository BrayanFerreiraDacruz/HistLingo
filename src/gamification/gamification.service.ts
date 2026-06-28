import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  calculateXPGain(baseXP: number, difficultyWeight: number, currentStreak: number): number {
    const bonusStreak = Math.floor(currentStreak / 5);
    return Math.floor(baseXP * difficultyWeight) + bonusStreak;
  }

  async updateStreak(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const lastActivity = user.lastActivityDate;

    if (!lastActivity) {
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          streakCount: 1,
          lastActivityDate: now,
        },
      });
    }

    const diffInHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    if (diffInHours > 48) {
      // Perdeu a ofensiva
      if (user.recoveryFreezeCount > 0) {
        return this.prisma.user.update({
          where: { id: userId },
          data: {
            recoveryFreezeCount: user.recoveryFreezeCount - 1,
            lastActivityDate: now,
          },
        });
      }
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          streakCount: 1,
          lastActivityDate: now,
        },
      });
    } else if (diffInHours > 24) {
      // Incrementa ofensiva
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          streakCount: user.streakCount + 1,
          lastActivityDate: now,
        },
      });
    }

    // Já fez atividade hoje ou menos de 24h atrás
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        lastActivityDate: now,
      },
    });
  }

  async addXP(userId: string, xp: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newXPTotal = user.xpTotal + xp;
    const newLevel = Math.floor(newXPTotal / 100) + 1; // Exemplo simples de nível: cada 100 XP sobe um nível

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        xpTotal: newXPTotal,
        level: newLevel,
      },
    });
  }
}
