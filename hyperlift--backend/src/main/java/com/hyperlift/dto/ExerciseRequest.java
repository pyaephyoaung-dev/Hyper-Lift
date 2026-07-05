package com.hyperlift.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseRequest {

    @NotBlank(message = "Exercise name is required")
    @Size(max = 150, message = "Exercise name must not exceed 150 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "Muscle group is required")
    @Size(max = 100, message = "Muscle group must not exceed 100 characters")
    private String muscleGroup;

    @Size(max = 100, message = "Equipment must not exceed 100 characters")
    private String equipment;

    @Size(max = 50, message = "Difficulty level must not exceed 50 characters")
    private String difficultyLevel;

    /** Link to a YouTube tutorial demonstrating the exercise. */
    @Size(max = 500, message = "Video URL must not exceed 500 characters")
    private String videoUrl;
}
