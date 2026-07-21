package com.hyperlift.service;

import com.hyperlift.dao.UserDao;
import com.hyperlift.dao.WorkoutDao;
import com.hyperlift.dao.WorkoutPlanDao;
import com.hyperlift.dao.WorkoutSplitDao;
import com.hyperlift.dto.SplitExerciseResponse;
import com.hyperlift.dto.WorkoutPlanRequest;
import com.hyperlift.dto.WorkoutPlanResponse;
import com.hyperlift.dto.WorkoutSplitResponse;
import com.hyperlift.entity.SplitExercise;
import com.hyperlift.entity.User;
import com.hyperlift.entity.Workout;
import com.hyperlift.entity.WorkoutPlan;
import com.hyperlift.entity.WorkoutSplit;
import com.hyperlift.exception.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkoutPlanService {

    private final WorkoutPlanDao workoutPlanDao;
    private final UserDao userDao;
    private final WorkoutSplitDao workoutSplitDao;
    private final WorkoutDao workoutDao;

    public WorkoutPlanService(WorkoutPlanDao workoutPlanDao, UserDao userDao,
                              WorkoutSplitDao workoutSplitDao, WorkoutDao workoutDao) {
        this.workoutPlanDao = workoutPlanDao;
        this.userDao = userDao;
        this.workoutSplitDao = workoutSplitDao;
        this.workoutDao = workoutDao;
    }

    public List<WorkoutPlanResponse> getAllWorkoutPlans() {
        return workoutPlanDao.findAll().stream()
                .map(plan -> convertToWorkoutPlanResponse(plan, null))
                .collect(Collectors.toList());
    }

    public WorkoutPlanResponse getWorkoutPlanById(Long id, Long requestingUserId) {
        WorkoutPlan plan = workoutPlanDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with id: " + id));
        return convertToWorkoutPlanResponse(plan, requestingUserId);
    }

    public List<WorkoutPlanResponse> getWorkoutPlansByUserId(Long userId) {
        return workoutPlanDao.findByUserId(userId).stream()
                .map(plan -> convertToWorkoutPlanResponse(plan, null))
                .collect(Collectors.toList());
    }

    public List<WorkoutPlanResponse> getPublicWorkoutPlans() {
        return workoutPlanDao.findByIsPublicTrue().stream()
                .map(plan -> convertToWorkoutPlanResponse(plan, null))
                .collect(Collectors.toList());
    }

    public List<WorkoutPlanResponse> matchWorkoutPlans(Integer daysPerWeek, Long requestingUserId) {
        return workoutPlanDao.findByDaysPerWeekAndIsPublicTrue(daysPerWeek).stream()
                .map(plan -> convertToWorkoutPlanResponse(plan, requestingUserId))
                .collect(Collectors.toList());
    }

    public List<WorkoutPlanResponse> searchWorkoutPlans(String name) {
        return workoutPlanDao.findByNameContainingIgnoreCase(name).stream()
                .map(plan -> convertToWorkoutPlanResponse(plan, null))
                .collect(Collectors.toList());
    }

    public WorkoutPlanResponse getActivePlanForUser(Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getActivePlan() == null) {
            return null;
        }
        return convertToWorkoutPlanResponse(user.getActivePlan(), userId);
    }

    public WorkoutPlanResponse selectActivePlan(Long planId, Long userId) {
        WorkoutPlan plan = workoutPlanDao.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with id: " + planId));
        User user = userDao.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        user.setActivePlan(plan);
        userDao.save(user);
        return convertToWorkoutPlanResponse(plan, userId);
    }

    public WorkoutPlanResponse createWorkoutPlan(WorkoutPlanRequest request, Long planCreatorId) {
        User creator = userDao.findById(planCreatorId)
                .orElseThrow(() -> new UserNotFoundException(planCreatorId));

        WorkoutPlan plan = WorkoutPlan.builder()
                .name(request.getName())
                .description(request.getDescription())
                .goal(request.getGoal())
                .difficultyLevel(request.getDifficultyLevel())
                .durationWeeks(request.getDurationWeeks())
                .isPublic(request.getIsPublic() == null || request.getIsPublic())
                .daysPerWeek(request.getDaysPerWeek())
                .hoursPerSession(request.getHoursPerSession())
                .user(creator)
                .build();

        WorkoutPlan savedPlan = workoutPlanDao.save(plan);
        return convertToWorkoutPlanResponse(savedPlan, null);
    }

    public WorkoutPlanResponse updateWorkoutPlan(Long id, WorkoutPlanRequest request) {
        WorkoutPlan plan = workoutPlanDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with id: " + id));

        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setGoal(request.getGoal());
        plan.setDifficultyLevel(request.getDifficultyLevel());
        plan.setDurationWeeks(request.getDurationWeeks());
        plan.setPublic(request.getIsPublic() != null ? request.getIsPublic() : plan.isPublic());
        plan.setDaysPerWeek(request.getDaysPerWeek());
        plan.setHoursPerSession(request.getHoursPerSession());

        WorkoutPlan updatedPlan = workoutPlanDao.save(plan);
        return convertToWorkoutPlanResponse(updatedPlan, null);
    }

    public void deleteWorkoutPlan(Long id) {
        if (!workoutPlanDao.existsById(id)) {
            throw new IllegalArgumentException("Workout plan not found with id: " + id);
        }

        List<User> usersWithThisActivePlan = userDao.findByActivePlanId(id);
        for (User user : usersWithThisActivePlan) {
            user.setActivePlan(null);
        }
        if (!usersWithThisActivePlan.isEmpty()) {
            userDao.saveAll(usersWithThisActivePlan);
        }

        List<WorkoutSplit> splits = workoutSplitDao.findByWorkoutPlanId(id);
        for (WorkoutSplit split : splits) {
            List<Workout> loggedWorkouts = workoutDao.findByWorkoutSplitId(split.getId());
            if (!loggedWorkouts.isEmpty()) {
                for (Workout workout : loggedWorkouts) {
                    workout.setWorkoutSplit(null);
                }
                workoutDao.saveAll(loggedWorkouts);
            }
        }

        workoutPlanDao.deleteById(id);
    }

    private WorkoutPlanResponse convertToWorkoutPlanResponse(WorkoutPlan plan, Long requestingUserId) {
        List<WorkoutSplitResponse> splitResponses = null;
        if (plan.getWorkoutSplits() != null) {
            splitResponses = plan.getWorkoutSplits().stream()
                    .map(this::convertToWorkoutSplitResponse)
                    .collect(Collectors.toList());
        }

        boolean isActive = false;
        if (requestingUserId != null) {
            User requester = userDao.findById(requestingUserId).orElse(null);
            isActive = requester != null && requester.getActivePlan() != null
                    && requester.getActivePlan().getId().equals(plan.getId());
        }

        return WorkoutPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .goal(plan.getGoal())
                .difficultyLevel(plan.getDifficultyLevel())
                .durationWeeks(plan.getDurationWeeks())
                .isPublic(plan.isPublic())
                .daysPerWeek(plan.getDaysPerWeek())
                .hoursPerSession(plan.getHoursPerSession())
                .userId(plan.getUser().getId())
                .username(plan.getUser().getUsername())
                .splits(splitResponses)
                .active(isActive)
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }

    private WorkoutSplitResponse convertToWorkoutSplitResponse(WorkoutSplit split) {
        List<SplitExerciseResponse> exerciseResponses = null;
        if (split.getSplitExercises() != null) {
            exerciseResponses = split.getSplitExercises().stream()
                    .sorted((a, b) -> {
                        int ai = a.getOrderIndex() != null ? a.getOrderIndex() : 0;
                        int bi = b.getOrderIndex() != null ? b.getOrderIndex() : 0;
                        return Integer.compare(ai, bi);
                    })
                    .map(this::convertToSplitExerciseResponse)
                    .collect(Collectors.toList());
        }

        return WorkoutSplitResponse.builder()
                .id(split.getId())
                .name(split.getName())
                .dayOfWeek(split.getDayOfWeek())
                .orderIndex(split.getOrderIndex())
                .workoutPlanId(split.getWorkoutPlan().getId())
                .workoutPlanName(split.getWorkoutPlan().getName())
                .exercises(exerciseResponses)
                .createdAt(split.getCreatedAt())
                .updatedAt(split.getUpdatedAt())
                .build();
    }

    private SplitExerciseResponse convertToSplitExerciseResponse(SplitExercise se) {
        return SplitExerciseResponse.builder()
                .id(se.getId())
                .exerciseId(se.getExercise().getId())
                .exerciseName(se.getExercise().getName())
                .muscleGroup(se.getExercise().getMuscleGroup())
                .sets(se.getSetCount())
                .reps(se.getReps())
                .orderIndex(se.getOrderIndex())
                .build();
    }
}