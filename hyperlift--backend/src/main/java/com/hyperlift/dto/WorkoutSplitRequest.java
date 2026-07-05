package com.hyperlift.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSplitRequest {

    @NotBlank(message = "Split name is required")
    @Size(max = 200, message = "Split name must not exceed 200 characters")
    private String name;

    @Size(max = 20, message = "Day of week must not exceed 20 characters")
    private String dayOfWeek;

    private Integer orderIndex;

    @NotNull(message = "Workout plan ID is required")
    private Long workoutPlanId;

    /** Exercises assigned to this day, each with its required sets/reps. */
    @Valid
    private List<SplitExerciseRequest> exercises;
}
