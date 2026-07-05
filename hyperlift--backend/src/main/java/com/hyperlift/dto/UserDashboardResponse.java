package com.hyperlift.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDashboardResponse {

    private long totalWorkouts;
    private long totalExercises;
    private long totalPlans;
    private List<WorkoutResponse> recentWorkouts;
    private long progressEntries;
}
