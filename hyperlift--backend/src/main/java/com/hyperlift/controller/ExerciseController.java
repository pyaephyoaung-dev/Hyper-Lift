package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.dto.ExerciseRequest;
import com.hyperlift.dto.ExerciseResponse;
import com.hyperlift.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "http://localhost:5173")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllExercises() {
        List<ExerciseResponse> exercises = exerciseService.getAllExercises();
        return ResponseEntity.ok(ApiResponse.success("Exercises retrieved successfully", exercises));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getExerciseById(@PathVariable Long id) {
        ExerciseResponse exercise = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(ApiResponse.success("Exercise retrieved successfully", exercise));
    }

    @GetMapping("/muscle-group/{muscleGroup}")
    public ResponseEntity<ApiResponse> getExercisesByMuscleGroup(@PathVariable String muscleGroup) {
        List<ExerciseResponse> exercises = exerciseService.getExercisesByMuscleGroup(muscleGroup);
        return ResponseEntity.ok(ApiResponse.success("Exercises retrieved successfully", exercises));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchExercises(@RequestParam String name) {
        List<ExerciseResponse> exercises = exerciseService.searchExercises(name);
        return ResponseEntity.ok(ApiResponse.success("Exercises retrieved successfully", exercises));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createExercise(@Valid @RequestBody ExerciseRequest request) {
        ExerciseResponse exercise = exerciseService.createExercise(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exercise created successfully", exercise));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateExercise(@PathVariable Long id,
                                                       @Valid @RequestBody ExerciseRequest request) {
        ExerciseResponse exercise = exerciseService.updateExercise(id, request);
        return ResponseEntity.ok(ApiResponse.success("Exercise updated successfully", exercise));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok(ApiResponse.success("Exercise deleted successfully"));
    }
}
