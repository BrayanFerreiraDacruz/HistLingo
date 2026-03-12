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

public class GamificationService {
    private final UserRepository userRepository;

    public GamificationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public int calculateXPGain(int baseXP, double difficultyWeight, int currentStreak) {
        int bonusStreak = currentStreak / 5;
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
            if (currentStreak.recoveryFreezeCount() > 0) {
                return saveWithNewStreak(user, currentStreak.useFreeze());
            }
            return saveWithNewStreak(user, currentStreak.reset());
        } else if (hoursSinceLastActivity > 24) {
            return saveWithNewStreak(user, currentStreak.increment());
        }

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

