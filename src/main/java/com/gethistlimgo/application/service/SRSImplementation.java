package com.gethistlimgo.application.service;
import com.gethistlimgo.domain.model.UserReview;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class SRSImplementation {
    public void calculateNextReview(UserReview review, int quality) {
        float ef = review.getEaseFactor() < 1.3f ? 2.5f : review.getEaseFactor();
        float newEf = ef + (0.1f - (5 - quality) * (0.08f + (5 - quality) * 0.02f));
        if (newEf < 1.3f) newEf = 1.3f;
        review.setEaseFactor(newEf);
        int interval;
        if (quality < 3) {
            interval = 1;
            review.setRepetitions(0);
        } else {
            if (review.getRepetitions() == 0) interval = 1;
            else if (review.getRepetitions() == 1) interval = 6;
            else interval = Math.round(review.getInterval() * newEf);
            review.setRepetitions(review.getRepetitions() + 1);
        }
        review.setInterval(interval);
        review.setNextReviewDate(LocalDateTime.now(). Bow().plusDays(interval));
    }
}
