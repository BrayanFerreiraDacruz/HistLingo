package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("modules")
public record Module(
    @Id Long id,
    String title,
    int order
) {}
