package com.hyperlift.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseResponse {

    private Long id;
    private String name;
    private String description;
    private String muscleGroup;
    private String equipment;
    private String difficultyLevel;
    private String videoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
