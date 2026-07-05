package com.hyperlift.service;

import com.hyperlift.dao.ExerciseDao;
import com.hyperlift.dao.UserDao;
import com.hyperlift.dao.WorkoutDao;
import com.hyperlift.dao.WorkoutSplitDao;
import com.hyperlift.dto.*;
import com.hyperlift.entity.*;
import com.hyperlift.exception.ExerciseNotFoundException;
import com.hyperlift.exception.UserNotFoundException;
import com.hyperlift.exception.WorkoutNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkoutService {

    private final WorkoutDao workoutDao;
    private final UserDao userDao;
    private final ExerciseDao exerciseDao;
    private final WorkoutSplitDao workoutSplitDao;

    public WorkoutService(WorkoutDao workoutDao, UserDao userDao,
                          ExerciseDao exerciseDao, WorkoutSplitDao workoutSplitDao) {
        this.workoutDao = workoutDao;
        this.userDao = userDao;
        this.exerciseDao = exerciseDao;
        this.workoutSplitDao = workoutSplitDao;
    }

    public List<WorkoutResponse> getAllWorkouts() {
        List<Workout> workouts = workoutDao.findAll();
        return workouts.stream()
                .map(this::convertToWorkoutResponse)
                .collect(Collectors.toList());
    }

    public WorkoutResponse getWorkoutById(Long id) {
        Workout workout = workoutDao.findById(id)
                .orElseThrow(() -> new WorkoutNotFoundException(id));
        return convertToWorkoutResponse(workout);
    }

    public List<WorkoutResponse> getWorkoutsByUserId(Long userId) {
        List<Workout> workouts = workoutDao.findByUserId(userId);
        return workouts.stream()
                .map(this::convertToWorkoutResponse)
                .collect(Collectors.toList());
    }

    public List<WorkoutResponse> getWorkoutsByUserIdAndDate(Long userId, LocalDate date) {
        List<Workout> workouts = workoutDao.findByUserIdAndWorkoutDate(userId, date);
        return workouts.stream()
                .map(this::convertToWorkoutResponse)
                .collect(Collectors.toList());
    }

    public List<WorkoutResponse> getWorkoutsByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Workout> workouts = workoutDao.findByUserIdAndWorkoutDateBetween(userId, startDate, endDate);
        return workouts.stream()
                .map(this::convertToWorkoutResponse)
                .collect(Collectors.toList());
    }

    public WorkoutResponse createWorkout(WorkoutRequest request, Long userId) {

        User user = userDao.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Workout workout = Workout.builder()
                .description(request.getDescription())
                .workoutDate(request.getWorkoutDate())
                .durationMinutes(request.getDurationMinutes())
                .user(user)
                .workoutExercises(new ArrayList<>())
                .build();

        if (request.getWorkoutSplitId() != null) {
            WorkoutSplit split = workoutSplitDao.findById(request.getWorkoutSplitId())
                    .orElseThrow(() -> new IllegalArgumentException("Workout split not found with id: " + request.getWorkoutSplitId()));
            workout.setWorkoutSplit(split);
        }

        if (request.getExercises() != null && !request.getExercises().isEmpty()) {
            for (WorkoutExerciseRequest exerciseRequest : request.getExercises()) {
                Exercise exercise = exerciseDao.findById(exerciseRequest.getExerciseId())
                        .orElseThrow(() -> new ExerciseNotFoundException(exerciseRequest.getExerciseId()));

                WorkoutExercise workoutExercise = WorkoutExercise.builder()
                        .sets(exerciseRequest.getSets())
                        .reps(exerciseRequest.getReps())
                        .weight(exerciseRequest.getWeight())
                        .restSeconds(exerciseRequest.getRestSeconds())
                        .orderIndex(exerciseRequest.getOrderIndex())
                        .notes(exerciseRequest.getNotes())
                        .completed(Boolean.TRUE.equals(exerciseRequest.getCompleted()))
                        .workout(workout)
                        .exercise(exercise)
                        .build();

                workout.getWorkoutExercises().add(workoutExercise);
            }
        }

        Workout savedWorkout = workoutDao.save(workout);
        return convertToWorkoutResponse(savedWorkout);
    }

    public WorkoutResponse updateWorkout(Long id, WorkoutRequest request) {
        Workout workout = workoutDao.findById(id)
                .orElseThrow(() -> new WorkoutNotFoundException(id));

        workout.setDescription(request.getDescription());
        workout.setWorkoutDate(request.getWorkoutDate());
        workout.setDurationMinutes(request.getDurationMinutes());

        if (request.getWorkoutSplitId() != null) {
            WorkoutSplit split = workoutSplitDao.findById(request.getWorkoutSplitId())
                    .orElseThrow(() -> new IllegalArgumentException("Workout split not found with id: " + request.getWorkoutSplitId()));
            workout.setWorkoutSplit(split);
        } else {
            workout.setWorkoutSplit(null);
        }

        workout.getWorkoutExercises().clear();
        if (request.getExercises() != null && !request.getExercises().isEmpty()) {
            for (WorkoutExerciseRequest exerciseRequest : request.getExercises()) {
                Exercise exercise = exerciseDao.findById(exerciseRequest.getExerciseId())
                        .orElseThrow(() -> new ExerciseNotFoundException(exerciseRequest.getExerciseId()));

                WorkoutExercise workoutExercise = WorkoutExercise.builder()
                        .sets(exerciseRequest.getSets())
                        .reps(exerciseRequest.getReps())
                        .weight(exerciseRequest.getWeight())
                        .restSeconds(exerciseRequest.getRestSeconds())
                        .orderIndex(exerciseRequest.getOrderIndex())
                        .notes(exerciseRequest.getNotes())
                        .completed(Boolean.TRUE.equals(exerciseRequest.getCompleted()))
                        .workout(workout)
                        .exercise(exercise)
                        .build();

                workout.getWorkoutExercises().add(workoutExercise);
            }
        }

        Workout updatedWorkout = workoutDao.save(workout);
        return convertToWorkoutResponse(updatedWorkout);
    }

    public void deleteWorkout(Long id) {
        if (!workoutDao.existsById(id)) {
            throw new WorkoutNotFoundException(id);
        }
        workoutDao.deleteById(id);
    }

    private WorkoutResponse convertToWorkoutResponse(Workout workout) {
        List<WorkoutExerciseResponse> exerciseResponses = workout.getWorkoutExercises().stream()
                .map(this::convertToWorkoutExerciseResponse)
                .collect(Collectors.toList());

        return WorkoutResponse.builder()
                .id(workout.getId())
                .description(workout.getDescription())
                .workoutDate(workout.getWorkoutDate())
                .durationMinutes(workout.getDurationMinutes())
                .userId(workout.getUser().getId())
                .username(workout.getUser().getUsername())
                .workoutSplitId(workout.getWorkoutSplit() != null ? workout.getWorkoutSplit().getId() : null)
                .workoutSplitName(workout.getWorkoutSplit() != null ? workout.getWorkoutSplit().getName() : null)
                .exercises(exerciseResponses)
                .createdAt(workout.getCreatedAt())
                .updatedAt(workout.getUpdatedAt())
                .build();
    }

    private WorkoutExerciseResponse convertToWorkoutExerciseResponse(WorkoutExercise workoutExercise) {
        return WorkoutExerciseResponse.builder()
                .id(workoutExercise.getId())
                .exerciseId(workoutExercise.getExercise().getId())
                .exerciseName(workoutExercise.getExercise().getName())
                .muscleGroup(workoutExercise.getExercise().getMuscleGroup())
                .sets(workoutExercise.getSets())
                .reps(workoutExercise.getReps())
                .weight(workoutExercise.getWeight())
                .restSeconds(workoutExercise.getRestSeconds())
                .orderIndex(workoutExercise.getOrderIndex())
                .notes(workoutExercise.getNotes())
                .completed(workoutExercise.isCompleted())
                .build();
    }
}
