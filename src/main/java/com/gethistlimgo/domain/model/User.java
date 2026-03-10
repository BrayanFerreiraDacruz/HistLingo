package com.gethistlimgo.domain.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "users") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String username;
    private String email;
    private String password;
    private int xpTotal;
    private int level;
    @Embedded private Streak streak;
}
