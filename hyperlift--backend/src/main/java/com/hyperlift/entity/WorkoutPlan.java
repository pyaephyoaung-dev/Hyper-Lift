package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlan extends BaseEntity {

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "goal", length = 200)
    private String goal;

    @Column(name = "difficulty_level", length = 50)
    private String difficultyLevel;

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "is_public", nullable = false)
    @Builder.Default
    private boolean isPublic = true;

    /** How many gym days/week this plan is designed for. Used to match
     *  a plan against a user's requested availability. */
    @Column(name = "days_per_week", nullable = false)
    private Integer daysPerWeek;

    @Column(name = "hours_per_session")
    private Double hoursPerSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "workoutPlan", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WorkoutSplit> workoutSplits = new ArrayList<>();
}
