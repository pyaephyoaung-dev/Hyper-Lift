package com.hyperlift.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlanRequest {

    @NotBlank(message = "Plan name is required")
    @Size(max = 200, message = "Plan name must not exceed 200 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 200, message = "Goal must not exceed 200 characters")
    private String goal;

    @Size(max = 50, message = "Difficulty level must not exceed 50 characters")
    private String difficultyLevel;

    private Integer durationWeeks;

    private Boolean isPublic;

    @NotNull(message = "Days per week is required")
    @Min(value = 1, message = "Days per week must be at least 1")
    private Integer daysPerWeek;

    private Double hoursPerSession;
}
