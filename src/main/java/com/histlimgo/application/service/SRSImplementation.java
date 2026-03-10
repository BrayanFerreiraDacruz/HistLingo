package com.histlimgo.application.service;

import com.histlimgo.domain.model.UserReview;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SRSImplementation {

    /**
     * Implementação do algoritmo SM-2 para cálculo do próximo intervalo de revisão.
     * @param review O registro de revisão atual do usuário.
     * @param quality A qualidade da resposta (0-5).
     * @return Um novo registro UserReview com os campos atualizados.
     */
    public UserReview calculateNextReview(UserReview review, int quality) {
        if (quality < 0 || quality > 5) {
            throw new IllegalArgumentException("Quality must be between 0 and 5.");
        }

        float easeFactor = review.easeFactor();
        int interval = review.interval();
        int repetitions = review.repetitions();

        // Se a resposta for ruim (quality < 3), reinicia as repetições
        if (quality < 3) {
            repetitions = 0;
            interval = 1;
        } else {
            if (repetitions == 0) {
                interval = 1;
            } else if (repetitions == 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions++;
        }

        // Cálculo do novo Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        float newEaseFactor = easeFactor + (0.1f - (5 - quality) * (0.08f + (5 - quality) * 0.02f));
        if (newEaseFactor < 1.3f) {
            newEaseFactor = 1.3f;
        }

        LocalDateTime nextReviewDate = LocalDateTime.now().plusDays(interval);

        return new UserReview(
            review.id(),
            review.userId(),
            review.challengeId(),
            newEaseFactor,
            interval,
            repetitions,
            nextReviewDate
        );
    }
}
