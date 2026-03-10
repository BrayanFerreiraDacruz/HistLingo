package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("challenges")
public record Challenge(
    @Id Long id,
    Long lessonId,
    String content,
    String correctAnswer,
    double difficultyWeight
) {}
