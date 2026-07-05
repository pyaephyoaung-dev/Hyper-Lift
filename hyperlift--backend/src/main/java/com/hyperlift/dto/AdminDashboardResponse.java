package com.hyperlift.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalWorkouts;
    private long totalExercises;
    private long totalPlans;
    private List<UserResponse> recentUsers;
}
