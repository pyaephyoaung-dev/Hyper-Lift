package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "split_exercise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SplitExercise extends BaseEntity {

    @Column(name = "set_count", nullable = false)
    private Integer setCount;

    @Column(name = "reps", nullable = false)
    private Integer reps;

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_split_id", nullable = false)
    private WorkoutSplit workoutSplit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}
