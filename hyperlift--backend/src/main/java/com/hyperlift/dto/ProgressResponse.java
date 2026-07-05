package com.hyperlift.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressResponse {

    private Long id;
    private LocalDate recordDate;
    private boolean restDay;
    private Long exerciseId;
    private String exerciseName;
    private String muscleGroup;
    private Double weight;
    private Integer reps;
    private Integer setNumber;
    private Double rpe;
    private Integer restTimeSeconds;
    private String notes;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
