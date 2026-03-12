package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("users")
public record User(
    @Id Long id,
    String username,
    String email,
    String password, // Note: Should be hashed in a real application
    @Column("xp_total")
    int xpTotal,
    int level,
    Streak streak
) {}
