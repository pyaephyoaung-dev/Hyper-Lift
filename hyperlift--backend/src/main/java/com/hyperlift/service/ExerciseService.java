package com.hyperlift.service;

import com.hyperlift.dao.ExerciseDao;
import com.hyperlift.dto.ExerciseRequest;
import com.hyperlift.dto.ExerciseResponse;
import com.hyperlift.entity.Exercise;
import com.hyperlift.exception.ExerciseNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExerciseService {

    private final ExerciseDao exerciseDao;

    public ExerciseService(ExerciseDao exerciseDao) {
        this.exerciseDao = exerciseDao;
    }

    public List<ExerciseResponse> getAllExercises() {
        List<Exercise> exercises = exerciseDao.findAll();
        return exercises.stream()
                .map(this::convertToExerciseResponse)
                .collect(Collectors.toList());
    }

    public ExerciseResponse getExerciseById(Long id) {
        Exercise exercise = exerciseDao.findById(id)
                .orElseThrow(() -> new ExerciseNotFoundException(id));
        return convertToExerciseResponse(exercise);
    }

    public List<ExerciseResponse> getExercisesByMuscleGroup(String muscleGroup) {
        List<Exercise> exercises = exerciseDao.findByMuscleGroup(muscleGroup);
        return exercises.stream()
                .map(this::convertToExerciseResponse)
                .collect(Collectors.toList());
    }

    public List<ExerciseResponse> searchExercises(String name) {
        List<Exercise> exercises = exerciseDao.findByNameContainingIgnoreCase(name);
        return exercises.stream()
                .map(this::convertToExerciseResponse)
                .collect(Collectors.toList());
    }

    public ExerciseResponse createExercise(ExerciseRequest request) {

        if (exerciseDao.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException("Exercise already exists with name: " + request.getName());
        }


        Exercise exercise = Exercise.builder()
                .name(request.getName())
                .description(request.getDescription())
                .muscleGroup(request.getMuscleGroup())
                .equipment(request.getEquipment())
                .difficultyLevel(request.getDifficultyLevel())
                .videoUrl(request.getVideoUrl())
                .build();

        Exercise savedExercise = exerciseDao.save(exercise);
        return convertToExerciseResponse(savedExercise);
    }

    public ExerciseResponse updateExercise(Long id, ExerciseRequest request) {
        Exercise exercise = exerciseDao.findById(id)
                .orElseThrow(() -> new ExerciseNotFoundException(id));

        exercise.setName(request.getName());
        exercise.setDescription(request.getDescription());
        exercise.setMuscleGroup(request.getMuscleGroup());
        exercise.setEquipment(request.getEquipment());
        exercise.setDifficultyLevel(request.getDifficultyLevel());
        exercise.setVideoUrl(request.getVideoUrl());

        Exercise updatedExercise = exerciseDao.save(exercise);
        return convertToExerciseResponse(updatedExercise);
    }

    public void deleteExercise(Long id) {
        if (!exerciseDao.existsById(id)) {
            throw new ExerciseNotFoundException(id);
        }
        exerciseDao.deleteById(id);
    }

    private ExerciseResponse convertToExerciseResponse(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .muscleGroup(exercise.getMuscleGroup())
                .equipment(exercise.getEquipment())
                .difficultyLevel(exercise.getDifficultyLevel())
                .videoUrl(exercise.getVideoUrl())
                .createdAt(exercise.getCreatedAt())
                .updatedAt(exercise.getUpdatedAt())
                .build();
    }
}
