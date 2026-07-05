package com.hyperlift.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExerciseRequest {

    @NotNull(message = "Exercise ID is required")
    private Long exerciseId;

    private Integer sets;

    private Integer reps;

    private Double weight;

    private Integer restSeconds;

    private Integer orderIndex;

    private String notes;

    private Boolean completed;
}
