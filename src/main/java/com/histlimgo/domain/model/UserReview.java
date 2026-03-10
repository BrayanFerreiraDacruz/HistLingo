package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("user_reviews")
public record UserReview(
    @Id Long id,
    Long userId,
    Long challengeId,
    float easeFactor,
    int interval,
    int repetitions,
    LocalDateTime nextReviewDate
) {}
