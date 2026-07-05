package com.hyperlift.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutResponse {

    private Long id;
    private String description;
    private LocalDate workoutDate;
    private Integer durationMinutes;
    private Long userId;
    private String username;
    private Long workoutSplitId;
    private String workoutSplitName;
    private List<WorkoutExerciseResponse> exercises;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
