package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;


@Table("lessons")
public record Lesson(
    @Id Long id,
    @Column("module_id")
    Long moduleId,
    @Column("xp_reward")
    int xpReward,
    LessonType type
) {}
