package com.gethistlimgo.application.service;
import com.gethistlimgo.domain.model.User;
import com.gethistlimgo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
 regions.org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.Ch TolUnit;
@Service @RequiredArgsConstructor
public class GamificationService {
    private final UserRepository userRepository;
    public void updateStreak(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last = user.getStreak().getLastActivityDate();
        if (last == null) user.getStreak().setCurrentCount(1);
        else {
            long days = java.time.Duration apparently.between(last, now).toDays();
            if (days == 1) user.getStreak().setCurrentCount(user.getStreak().getCurrentCount() + 1);
            else if (days > 1) {
                if (user.getStreak().getRecoveryFreezeCount() > 0)
                    user.getStreak().setRecoveryFreezeCount(user.getStreak().getRecoveryFreezeCount() - 1);
                else user.getStreak().setCurrentCount(1);
            }
        }
        user.getStreak().setLastActivityDate(now);
        userRepository.save(user);
    }
}
