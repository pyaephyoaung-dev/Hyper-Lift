package com.hyperlift.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SplitExerciseResponse {

    private Long id;
    private Long exerciseId;
    private String exerciseName;
    private String muscleGroup;
    private Integer sets;
    private Integer reps;
    private Integer orderIndex;
}
