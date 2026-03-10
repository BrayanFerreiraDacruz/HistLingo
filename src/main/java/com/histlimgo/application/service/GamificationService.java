package com.histlimgo.application.service;

import com.histlimgo.domain.model.Streak;
import com.histlimgo.domain.model.User;
import com.histlimgo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class GamificationService {
    private final UserRepository userRepository;

    public int calculateXPGain(int baseXP, double difficultyWeight, int currentStreak) {
        // XP_{ganho} = (BaseXP \times MultiplicadorDificuldade) + BonusStreak.
        int bonusStreak = currentStreak / 5; // Example: 1 XP bonus for every 5 days of streak
        return (int) (baseXP * difficultyWeight) + bonusStreak;
    }

    @Transactional
    public User updateStreak(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        Streak currentStreak = user.streak();
        
        if (currentStreak.lastActivityDate() == null) {
            return saveWithNewStreak(user, currentStreak.reset());
        }

        long hoursSinceLastActivity = ChronoUnit.HOURS.between(currentStreak.lastActivityDate(), now);

        if (hoursSinceLastActivity > 48) {
            // Se now() - lastActivity > 48h -> resetStreak().
            if (currentStreak.recoveryFreezeCount() > 0) {
                return saveWithNewStreak(user, currentStreak.useFreeze());
            }
            return saveWithNewStreak(user, currentStreak.reset());
        } else if (hoursSinceLastActivity > 24) {
            // Se now() - lastActivity > 24h -> incrementStreak().
            return saveWithNewStreak(user, currentStreak.increment());
        }

        // If less than 24h, just update the last activity date without incrementing
        return saveWithNewStreak(user, new Streak(currentStreak.currentCount(), now, currentStreak.recoveryFreezeCount()));
    }

    private User saveWithNewStreak(User user, Streak newStreak) {
        User updatedUser = new User(
            user.id(),
            user.username(),
            user.email(),
            user.password(),
            user.xpTotal(),
            user.level(),
            newStreak
        );
        return userRepository.save(updatedUser);
    }
}
