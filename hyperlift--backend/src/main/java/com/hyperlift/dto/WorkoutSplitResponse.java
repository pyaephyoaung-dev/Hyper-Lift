package com.hyperlift.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutSplitResponse {

    private Long id;
    private String name;
    private String dayOfWeek;
    private Integer orderIndex;
    private Long workoutPlanId;
    private String workoutPlanName;
    private List<SplitExerciseResponse> exercises;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
