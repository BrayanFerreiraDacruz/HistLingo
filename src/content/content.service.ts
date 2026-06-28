import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedModules();
  }

  private async seedModules() {
    const modulesData = [
      {
        order: 1,
        title: 'Raízes Profundas',
        description:
          'Povos Originários: Cultura indígena antes de 1500, troncos linguísticos, organização social e mitologias.',
      },
      {
        order: 2,
        title: 'O Encontro e o Choque',
        description:
          'Período Colonial Inicial: Chegada dos portugueses, ciclos econômicos (pau-brasil, açúcar) e resistência indígena/africana.',
      },
      {
        order: 3,
        title: 'Brasil Império',
        description:
          'Independência e Monarquia: A vinda da Família Real, D. Pedro I e II, Abolição e a transição para a República.',
      },
      {
        order: 4,
        title: 'Ordem e Progresso?',
        description:
          'República Velha e Era Vargas: Coronelismo, movimentos sociais (Canudos, Vacina) e a industrialização.',
      },
      {
        order: 5,
        title: 'Tempos Modernos',
        description:
          'Ditadura e Redemocratização: O golpe de 64, movimentos de resistência, Diretas Já e a Constituição de 88.',
      },
    ];

    for (const modData of modulesData) {
      const module = await this.prisma.module.upsert({
        where: { order: modData.order },
        update: { title: modData.title, description: modData.description },
        create: {
          title: modData.title,
          description: modData.description,
          order: modData.order,
        },
      });

      // Seed Lessons for Module 1
      if (modData.order === 1) {
        const lesson = await this.prisma.lesson.upsert({
          where: { id: 'lesson-1-mod-1' },
          update: {},
          create: {
            id: 'lesson-1-mod-1',
            moduleId: module.id,
            order: 1,
            title: 'Os Primeiros Habitantes',
            content:
              'Antes da chegada dos portugueses em 1500, o Brasil já era habitado por milhões de pessoas. Esses povos possuíam organizações sociais complexas e culturas ricas.',
            xpReward: 15,
          },
        });

        // Seed Challenges for Lesson 1
        await this.prisma.challenge.upsert({
          where: { id: 'challenge-1-lesson-1' },
          update: {},
          create: {
            id: 'challenge-1-lesson-1',
            lessonId: lesson.id,
            type: 'WHO_AM_I',
            content:
              'Dica 1: Sou um dos maiores troncos linguísticos da América do Sul. Dica 2: Meus povos habitavam grande parte do litoral brasileiro.',
            correctAnswer: 'Tupi',
            explanation:
              'O tronco Tupi-Guarani é um dos mais importantes da América do Sul.',
            difficultyWeight: 1.0,
          },
        });
      }
    }
  }

  async getModules() {
    return this.prisma.module.findMany({
      orderBy: { order: 'asc' },
      include: { lessons: true },
    });
  }

  async getLessonsByModule(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
  }

  async getChallengesByLesson(lessonId: string) {
    return this.prisma.challenge.findMany({
      where: { lessonId },
    });
  }
}
