package com.hyperlift.service;

import com.hyperlift.dao.ExerciseDao;
import com.hyperlift.dao.ProgressDao;
import com.hyperlift.dao.UserDao;
import com.hyperlift.dto.ProgressRequest;
import com.hyperlift.dto.ProgressResponse;
import com.hyperlift.entity.Exercise;
import com.hyperlift.entity.Progress;
import com.hyperlift.entity.User;
import com.hyperlift.exception.ExerciseNotFoundException;
import com.hyperlift.exception.UserNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProgressService {

    private final ProgressDao progressDao;
    private final UserDao userDao;
    private final ExerciseDao exerciseDao;

    public ProgressService(ProgressDao progressDao, UserDao userDao, ExerciseDao exerciseDao) {
        this.progressDao = progressDao;
        this.userDao = userDao;
        this.exerciseDao = exerciseDao;
    }

    public List<ProgressResponse> getProgressByUserId(Long userId) {
        List<Progress> progressList = progressDao.findByUserIdOrderByRecordDateDescCreatedAtDesc(userId);
        return progressList.stream()
                .map(this::convertToProgressResponse)
                .collect(Collectors.toList());
    }

    public ProgressResponse getProgressById(Long id) {
        Progress progress = progressDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Progress record not found with id: " + id));
        return convertToProgressResponse(progress);
    }

    public List<ProgressResponse> getProgressByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Progress> progressList = progressDao.findByUserIdAndRecordDateBetween(userId, startDate, endDate);
        return progressList.stream()
                .map(this::convertToProgressResponse)
                .collect(Collectors.toList());
    }

    public ProgressResponse createProgress(ProgressRequest request, Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        LocalDate recordDate = request.getRecordDate() != null ? request.getRecordDate() : LocalDate.now();

        if (Boolean.TRUE.equals(request.getRestDay())) {
            Progress restDay = Progress.builder()
                    .recordDate(recordDate)
                    .restDay(true)
                    .notes(request.getNotes())
                    .user(user)
                    .build();
            return convertToProgressResponse(progressDao.save(restDay));
        }

        if (request.getExerciseId() == null) {
            throw new IllegalArgumentException("Exercise is required");
        }
        if (request.getWeight() == null) {
            throw new IllegalArgumentException("Weight is required");
        }
        if (request.getReps() == null) {
            throw new IllegalArgumentException("Reps is required");
        }

        Exercise exercise = exerciseDao.findById(request.getExerciseId())
                .orElseThrow(() -> new ExerciseNotFoundException(request.getExerciseId()));

        int nextSetNumber = progressDao.countByUserIdAndExerciseIdAndRecordDate(userId, exercise.getId(), recordDate) + 1;

        Progress progress = Progress.builder()
                .recordDate(recordDate)
                .exercise(exercise)
                .weight(request.getWeight())
                .reps(request.getReps())
                .setNumber(nextSetNumber)
                .rpe(request.getRpe())
                .restTimeSeconds(request.getRestTimeSeconds())
                .notes(request.getNotes())
                .restDay(false)
                .user(user)
                .build();

        Progress savedProgress = progressDao.save(progress);
        return convertToProgressResponse(savedProgress);
    }

    public ProgressResponse updateProgress(Long id, ProgressRequest request) {
        Progress progress = progressDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Progress record not found with id: " + id));

        if (!progress.isRestDay() && request.getExerciseId() != null
                && (progress.getExercise() == null || !request.getExerciseId().equals(progress.getExercise().getId()))) {
            Exercise exercise = exerciseDao.findById(request.getExerciseId())
                    .orElseThrow(() -> new ExerciseNotFoundException(request.getExerciseId()));
            progress.setExercise(exercise);
        }
        if (request.getRecordDate() != null) {
            progress.setRecordDate(request.getRecordDate());
        }
        if (!progress.isRestDay()) {
            progress.setWeight(request.getWeight());
            progress.setReps(request.getReps());
            progress.setRpe(request.getRpe());
            progress.setRestTimeSeconds(request.getRestTimeSeconds());
        }
        progress.setNotes(request.getNotes());

        Progress updatedProgress = progressDao.save(progress);
        return convertToProgressResponse(updatedProgress);
    }

    public void deleteProgress(Long id) {
        if (!progressDao.existsById(id)) {
            throw new IllegalArgumentException("Progress record not found with id: " + id);
        }
        progressDao.deleteById(id);
    }

    private ProgressResponse convertToProgressResponse(Progress progress) {
        Exercise exercise = progress.getExercise();
        return ProgressResponse.builder()
                .id(progress.getId())
                .recordDate(progress.getRecordDate())
                .restDay(progress.isRestDay())
                .exerciseId(exercise != null ? exercise.getId() : null)
                .exerciseName(exercise != null ? exercise.getName() : null)
                .muscleGroup(exercise != null ? exercise.getMuscleGroup() : null)
                .weight(progress.getWeight())
                .reps(progress.getReps())
                .setNumber(progress.getSetNumber())
                .rpe(progress.getRpe())
                .restTimeSeconds(progress.getRestTimeSeconds())
                .notes(progress.getNotes())
                .userId(progress.getUser().getId())
                .username(progress.getUser().getUsername())
                .createdAt(progress.getCreatedAt())
                .updatedAt(progress.getUpdatedAt())
                .build();
    }
}
