package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.dto.WorkoutRequest;
import com.hyperlift.dto.WorkoutResponse;
import com.hyperlift.security.SecurityUser;
import com.hyperlift.service.WorkoutService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllWorkouts() {
        List<WorkoutResponse> workouts = workoutService.getAllWorkouts();
        return ResponseEntity.ok(ApiResponse.success("Workouts retrieved successfully", workouts));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyWorkouts(Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long userId = ((SecurityUser) authentication.getPrincipal()).getId();
        List<WorkoutResponse> workouts = workoutService.getWorkoutsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Workouts retrieved successfully", workouts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getWorkoutById(@PathVariable Long id) {
        WorkoutResponse workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(ApiResponse.success("Workout retrieved successfully", workout));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getWorkoutsByUserId(@PathVariable Long userId) {
        List<WorkoutResponse> workouts = workoutService.getWorkoutsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Workouts retrieved successfully", workouts));
    }

    @GetMapping("/user/{userId}/date")
    public ResponseEntity<ApiResponse> getWorkoutsByUserIdAndDate(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<WorkoutResponse> workouts = workoutService.getWorkoutsByUserIdAndDate(userId, date);
        return ResponseEntity.ok(ApiResponse.success("Workouts retrieved successfully", workouts));
    }

    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<ApiResponse> getWorkoutsByUserIdAndDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<WorkoutResponse> workouts = workoutService.getWorkoutsByUserIdAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Workouts retrieved successfully", workouts));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createWorkout(@Valid @RequestBody WorkoutRequest request,
                                                       Authentication authentication) {
        Long userId = currentUserId(authentication);
        WorkoutResponse workout = workoutService.createWorkout(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Workout created successfully", workout));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateWorkout(@PathVariable Long id,
                                                      @Valid @RequestBody WorkoutRequest request) {
        WorkoutResponse workout = workoutService.updateWorkout(id, request);
        return ResponseEntity.ok(ApiResponse.success("Workout updated successfully", workout));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok(ApiResponse.success("Workout deleted successfully"));
    }

    private Long currentUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser securityUser)) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        return securityUser.getId();
    }
}
