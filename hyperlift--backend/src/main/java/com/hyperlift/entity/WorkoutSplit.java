package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_splits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSplit extends BaseEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "day_of_week", length = 20)
    private String dayOfWeek;

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    @OneToMany(mappedBy = "workoutSplit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Workout> workouts = new ArrayList<>();

    @OneToMany(mappedBy = "workoutSplit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SplitExercise> splitExercises = new ArrayList<>();
}
