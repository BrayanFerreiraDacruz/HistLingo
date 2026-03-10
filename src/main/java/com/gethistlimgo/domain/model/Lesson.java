package com.gethistlimgo.domain.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "lessons") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Lesson {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    @ManyToOne @JoinColumn(name = "module_id") private Module module;
    private int xpReward;
    @Enumerated(EnumType.STRING) private LessonType type;
}
