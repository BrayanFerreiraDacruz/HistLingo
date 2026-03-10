package com.gethistlimgo.domain.model;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Entity @Table(name = "modules") @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Module {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private int sortOrder;
    @OneToMany(mappedBy = "module") private List<Lesson> lessons;
}
