package com.histlimgo.api.v1.controller;

import com.histlimgo.api.v1.dto.UserDTO;
import com.histlimgo.application.service.GamificationService;
import com.histlimgo.domain.model.User;
import com.histlimgo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/streak/update")
    public ResponseEntity<UserDTO> updateStreak(@PathVariable Long id) {
        User updatedUser = gamificationService.updateStreak(id);
        return ResponseEntity.ok(toDTO(updatedUser));
    }

    private UserDTO toDTO(User user) {
        return new UserDTO(
            user.id(),
            user.username(),
            user.email(),
            user.xpTotal(),
            user.level(),
            user.streak().currentCount()
        );
    }
}
