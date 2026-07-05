package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * A single exercise assigned to a {@link WorkoutSplit} day, together with
 * the required sets/reps the admin defined for it. This is the template
 * used when a plan is previewed/selected — it is not a performance log.
 */
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
