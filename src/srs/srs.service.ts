import { Injectable } from '@nestjs/common';

interface ReviewData {
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
}

@Injectable()
export class SrsService {
  calculateNextReview(
    review: ReviewData,
    quality: number,
  ): {
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: Date;
  } {
    if (quality < 0 || quality > 5) {
      throw new Error('Quality must be between 0 and 5.');
    }

    let easeFactor = review.easeFactor ?? 2.5;
    let interval = review.interval ?? 0;
    let repetitions = review.repetitions ?? 0;

    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return { easeFactor, interval, repetitions, nextReviewDate };
  }
}
