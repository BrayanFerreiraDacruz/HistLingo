package com.histlimgo.api.v1.dto;

public record UserDTO(
    Long id,
    String username,
    String email,
    int xpTotal,
    int level,
    int currentStreak
) {}
