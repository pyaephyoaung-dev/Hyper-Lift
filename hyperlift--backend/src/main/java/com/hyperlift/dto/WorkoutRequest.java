package com.hyperlift.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutRequest {

    @NotBlank(message = "Workout description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Workout date is required")
    private LocalDate workoutDate;

    private Integer durationMinutes;

    private Long workoutSplitId;

    @Valid
    private List<WorkoutExerciseRequest> exercises;
}
