package com.hyperlift.service;

import com.hyperlift.dao.ExerciseDao;
import com.hyperlift.dao.WorkoutPlanDao;
import com.hyperlift.dao.WorkoutSplitDao;
import com.hyperlift.dto.SplitExerciseRequest;
import com.hyperlift.dto.SplitExerciseResponse;
import com.hyperlift.dto.WorkoutSplitRequest;
import com.hyperlift.dto.WorkoutSplitResponse;
import com.hyperlift.entity.Exercise;
import com.hyperlift.entity.SplitExercise;
import com.hyperlift.entity.WorkoutPlan;
import com.hyperlift.entity.WorkoutSplit;
import com.hyperlift.exception.ExerciseNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkoutSplitService {

    private final WorkoutSplitDao workoutSplitDao;
    private final WorkoutPlanDao workoutPlanDao;
    private final ExerciseDao exerciseDao;

    public WorkoutSplitService(WorkoutSplitDao workoutSplitDao, WorkoutPlanDao workoutPlanDao,
                               ExerciseDao exerciseDao) {
        this.workoutSplitDao = workoutSplitDao;
        this.workoutPlanDao = workoutPlanDao;
        this.exerciseDao = exerciseDao;
    }

    public List<WorkoutSplitResponse> getSplitsByPlanId(Long planId) {
        List<WorkoutSplit> splits = workoutSplitDao.findByWorkoutPlanIdOrderByOrderIndexAsc(planId);
        return splits.stream()
                .map(this::convertToWorkoutSplitResponse)
                .collect(Collectors.toList());
    }

    public WorkoutSplitResponse getSplitById(Long id) {
        WorkoutSplit split = workoutSplitDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout split not found with id: " + id));
        return convertToWorkoutSplitResponse(split);
    }

    public WorkoutSplitResponse createSplit(WorkoutSplitRequest request) {
        WorkoutPlan plan = workoutPlanDao.findById(request.getWorkoutPlanId())
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with id: " + request.getWorkoutPlanId()));

        WorkoutSplit split = WorkoutSplit.builder()
                .name(request.getName())
                .dayOfWeek(request.getDayOfWeek())
                .orderIndex(request.getOrderIndex())
                .restDay(Boolean.TRUE.equals(request.getRestDay()))
                .workoutPlan(plan)
                .splitExercises(new ArrayList<>())
                .build();

        if (!Boolean.TRUE.equals(request.getRestDay())) {
            applyExercises(split, request.getExercises());
        }

        WorkoutSplit savedSplit = workoutSplitDao.save(split);
        return convertToWorkoutSplitResponse(savedSplit);
    }

    public WorkoutSplitResponse updateSplit(Long id, WorkoutSplitRequest request) {
        WorkoutSplit split = workoutSplitDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout split not found with id: " + id));

        split.setName(request.getName());
        split.setDayOfWeek(request.getDayOfWeek());
        split.setOrderIndex(request.getOrderIndex());
        split.setRestDay(Boolean.TRUE.equals(request.getRestDay()));

        split.getSplitExercises().clear();
        if (!Boolean.TRUE.equals(request.getRestDay())) {
            applyExercises(split, request.getExercises());
        }

        WorkoutSplit updatedSplit = workoutSplitDao.save(split);
        return convertToWorkoutSplitResponse(updatedSplit);
    }

    public void deleteSplit(Long id) {
        if (!workoutSplitDao.existsById(id)) {
            throw new IllegalArgumentException("Workout split not found with id: " + id);
        }
        workoutSplitDao.deleteById(id);
    }

    private void applyExercises(WorkoutSplit split, List<SplitExerciseRequest> exerciseRequests) {
        if (exerciseRequests == null || exerciseRequests.isEmpty()) {
            return;
        }
        int fallbackIndex = 0;
        for (SplitExerciseRequest exerciseRequest : exerciseRequests) {
            Exercise exercise = exerciseDao.findById(exerciseRequest.getExerciseId())
                    .orElseThrow(() -> new ExerciseNotFoundException(exerciseRequest.getExerciseId()));

            SplitExercise splitExercise = SplitExercise.builder()
                    .setCount(exerciseRequest.getSets())
                    .reps(exerciseRequest.getReps())
                    .orderIndex(exerciseRequest.getOrderIndex() != null ? exerciseRequest.getOrderIndex() : fallbackIndex)
                    .workoutSplit(split)
                    .exercise(exercise)
                    .build();

            split.getSplitExercises().add(splitExercise);
            fallbackIndex++;
        }
    }

    // Manual Entity to DTO conversion
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
                .restDay(Boolean.TRUE.equals(split.getRestDay()))
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