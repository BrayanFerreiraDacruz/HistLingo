package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

public enum LessonType { THEORY, QUIZ }

@Table("lessons")
public record Lesson(
    @Id Long id,
    Long moduleId,
    int xpReward,
    LessonType type
) {}
