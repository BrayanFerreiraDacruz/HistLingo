package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("user_reviews")
public record UserReview(
    @Id Long id,
    @Column("user_id")
    Long userId,
    @Column("challenge_id")
    Long challengeId,
    @Column("ease_factor")
    float easeFactor,
    int interval,
    int repetitions,
    @Column("next_review_date")
    LocalDateTime nextReviewDate
) {}
