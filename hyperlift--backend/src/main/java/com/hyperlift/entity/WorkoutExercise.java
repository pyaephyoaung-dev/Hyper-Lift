package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise extends BaseEntity {

    @Column(name = "set_count")
    private Integer sets;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}
