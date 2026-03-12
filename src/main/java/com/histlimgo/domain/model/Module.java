package com.histlimgo.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("modules")
public record Module(
    @Id Long id,
    String title,
    @Column("sort_order")
    int sortOrder
) {}
