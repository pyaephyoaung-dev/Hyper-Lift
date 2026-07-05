package com.hyperlift.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExerciseResponse {

    private Long id;
    private Long exerciseId;
    private String exerciseName;
    private String muscleGroup;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private Integer restSeconds;
    private Integer orderIndex;
    private String notes;
    private boolean completed;
}
