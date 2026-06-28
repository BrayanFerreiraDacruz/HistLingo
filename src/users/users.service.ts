import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password, // Em produção, usar hash!
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async updateStreak(id: string) {
    return this.gamification.updateStreak(id);
  }

  async submitAnswer(userId: string, challengeId: string, quality: number) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) throw new Error('Challenge not found');

    // 1. Atualizar SRS
    const existingReview = await this.prisma.userReview.findFirst({
      where: { userId, challengeId },
    });

    const srsData = this.srs.calculateNextReview(
      existingReview || {},
      quality,
    );

    if (existingReview) {
      await this.prisma.userReview.update({
        where: { id: existingReview.id },
        data: srsData,
      });
    } else {
      await this.prisma.userReview.create({
        data: {
          userId,
          challengeId,
          ...srsData,
        },
      });
    }

    // 2. Adicionar XP e atualizar Streak se for a primeira do dia
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const xpGain = this.gamification.calculateXPGain(
      10, // base XP
      challenge.difficultyWeight,
      user.streakCount,
    );

    await this.gamification.addXP(userId, xpGain);
    await this.gamification.updateStreak(userId);

    return {
      xpGain,
      nextReviewDate: srsData.nextReviewDate,
    };
  }
}
