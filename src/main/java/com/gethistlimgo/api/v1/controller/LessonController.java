package com.gethistlimgo.api.v1.controller;
import com.gethistlimgo.application.service.GamificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lessons")
public class LessonController {
    private final GamificationService gamificationService;
    public LessonController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }
    @PostMapping("/{id}/complete")
    public void completeLesson(@PathVariable Long id, @RequestParam Long userId) {
        gamificationService.updateStreak(userId);
    }
}
