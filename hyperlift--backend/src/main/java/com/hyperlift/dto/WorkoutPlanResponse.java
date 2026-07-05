package com.hyperlift.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlanResponse {

    private Long id;
    private String name;
    private String description;
    private String goal;
    private String difficultyLevel;
    private Integer durationWeeks;
    private boolean isPublic;
    private Integer daysPerWeek;
    private Double hoursPerSession;
    private Long userId;
    private String username;
    private List<WorkoutSplitResponse> splits;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
