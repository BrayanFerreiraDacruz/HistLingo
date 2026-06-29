import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private db: PrismaService) {}

  calculateXPGain(baseXP: number, difficultyWeight: number, currentStreak: number): number {
    const bonusStreak = Math.floor(currentStreak / 5);
    return Math.floor(baseXP * difficultyWeight) + bonusStreak;
  }

  async updateStreak(userId: string) {
    const user = await this.db.queryOne<{
      id: string; streak_count: number; last_activity_date: Date | null; recovery_freeze_count: number;
    }>('SELECT id, streak_count, last_activity_date, recovery_freeze_count FROM users WHERE id = ? LIMIT 1', [userId]);

    if (!user) throw new Error('User not found');
    const now = new Date();

    if (!user.last_activity_date) {
      await this.db.run('UPDATE users SET streak_count = 1, last_activity_date = ?, updated_at = NOW() WHERE id = ?', [now, userId]);
      return;
    }

    const diffHours = (now.getTime() - new Date(user.last_activity_date).getTime()) / 3600000;

    if (diffHours > 48) {
      if (user.recovery_freeze_count > 0) {
        await this.db.run(
          'UPDATE users SET recovery_freeze_count = recovery_freeze_count - 1, last_activity_date = ?, updated_at = NOW() WHERE id = ?',
          [now, userId]
        );
      } else {
        await this.db.run('UPDATE users SET streak_count = 1, last_activity_date = ?, updated_at = NOW() WHERE id = ?', [now, userId]);
      }
    } else if (diffHours > 24) {
      await this.db.run(
        'UPDATE users SET streak_count = streak_count + 1, last_activity_date = ?, updated_at = NOW() WHERE id = ?',
        [now, userId]
      );
    } else {
      await this.db.run('UPDATE users SET last_activity_date = ?, updated_at = NOW() WHERE id = ?', [now, userId]);
    }
  }

  async addXP(userId: string, xp: number) {
    await this.db.run(
      'UPDATE users SET xp_total = xp_total + ?, level = FLOOR((xp_total + ?) / 100) + 1, updated_at = NOW() WHERE id = ?',
      [xp, xp, userId]
    );
  }
}
