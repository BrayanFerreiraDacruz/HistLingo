package com.histlimgo.domain.model;

import java.time.LocalDateTime;

public record Streak(
    int currentCount,
    LocalDateTime lastActivityDate,
    int recoveryFreezeCount
) {
    public Streak increment() {
        return new Streak(currentCount + 1, LocalDateTime.now(), recoveryFreezeCount);
    }

    public Streak reset() {
        return new Streak(1, LocalDateTime.now(), recoveryFreezeCount);
    }

    public Streak useFreeze() {
        if (recoveryFreezeCount <= 0) {
            throw new IllegalStateException("No recovery freezes available");
        }
        return new Streak(currentCount, LocalDateTime.now(), recoveryFreezeCount - 1);
    }
}
