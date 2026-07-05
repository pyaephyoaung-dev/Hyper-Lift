package com.hyperlift.service;

import com.hyperlift.dao.ExerciseDao;
import com.hyperlift.dao.ProgressDao;
import com.hyperlift.dao.WorkoutDao;
import com.hyperlift.dao.WorkoutPlanDao;
import com.hyperlift.dto.AdminDashboardResponse;
import com.hyperlift.dto.UserDashboardResponse;
import com.hyperlift.dto.WorkoutResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private static final int RECENT_USERS_LIMIT = 5;
    private static final int RECENT_WORKOUTS_LIMIT = 5;

    private final UserService userService;
    private final WorkoutService workoutService;
    private final WorkoutDao workoutDao;
    private final ExerciseDao exerciseDao;
    private final WorkoutPlanDao workoutPlanDao;
    private final ProgressDao progressDao;

    public DashboardService(UserService userService, WorkoutService workoutService,
                             WorkoutDao workoutDao, ExerciseDao exerciseDao,
                             WorkoutPlanDao workoutPlanDao, ProgressDao progressDao) {
        this.userService = userService;
        this.workoutService = workoutService;
        this.workoutDao = workoutDao;
        this.exerciseDao = exerciseDao;
        this.workoutPlanDao = workoutPlanDao;
        this.progressDao = progressDao;
    }

    public AdminDashboardResponse getAdminDashboard() {
        return AdminDashboardResponse.builder()
                .totalUsers(userService.countUsers())
                .totalWorkouts(workoutDao.count())
                .totalExercises(exerciseDao.count())
                .totalPlans(workoutPlanDao.count())
                .recentUsers(userService.getRecentUsers(RECENT_USERS_LIMIT))
                .build();
    }

    public UserDashboardResponse getUserDashboard(Long userId) {
        List<WorkoutResponse> workouts = workoutService.getWorkoutsByUserId(userId);
        List<WorkoutResponse> recentWorkouts = workouts.stream()
                .limit(RECENT_WORKOUTS_LIMIT)
                .toList();

        return UserDashboardResponse.builder()
                .totalWorkouts(workouts.size())
                .totalExercises(exerciseDao.count())
                .totalPlans(workoutPlanDao.findByUserId(userId).size())
                .recentWorkouts(recentWorkouts)
                .progressEntries(progressDao.findByUserId(userId).size())
                .build();
    }
}
