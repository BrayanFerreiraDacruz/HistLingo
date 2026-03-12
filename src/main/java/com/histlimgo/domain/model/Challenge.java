package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("challenges")
public record Challenge(
    @Id Long id,
    @Column("lesson_id")
    Long lessonId,
    String content,
    @Column("correct_answer")
    String correctAnswer,
    @Column("difficulty_weight")
    double difficultyWeight
) {}
