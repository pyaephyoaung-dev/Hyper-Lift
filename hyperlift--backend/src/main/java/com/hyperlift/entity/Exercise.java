package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise extends BaseEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "muscle_group", nullable = false, length = 100)
    private String muscleGroup;

    @Column(name = "equipment", length = 100)
    private String equipment;

    @Column(name = "difficulty_level", length = 50)
    private String difficultyLevel;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkoutExercise> workoutExercises = new ArrayList<>();
}
