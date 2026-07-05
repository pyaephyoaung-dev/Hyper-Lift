package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.dto.WorkoutPlanRequest;
import com.hyperlift.dto.WorkoutPlanResponse;
import com.hyperlift.security.SecurityUser;
import com.hyperlift.service.WorkoutPlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService) {
        this.workoutPlanService = workoutPlanService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllWorkoutPlans() {
        List<WorkoutPlanResponse> plans = workoutPlanService.getAllWorkoutPlans();
        return ResponseEntity.ok(ApiResponse.success("Workout plans retrieved successfully", plans));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getWorkoutPlanById(@PathVariable Long id, Authentication authentication) {
        Long requesterId = authentication != null ? ((SecurityUser) authentication.getPrincipal()).getId() : null;
        WorkoutPlanResponse plan = workoutPlanService.getWorkoutPlanById(id, requesterId);
        return ResponseEntity.ok(ApiResponse.success("Workout plan retrieved successfully", plan));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getWorkoutPlansByUserId(@PathVariable Long userId) {
        List<WorkoutPlanResponse> plans = workoutPlanService.getWorkoutPlansByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Workout plans retrieved successfully", plans));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse> getPublicWorkoutPlans() {
        List<WorkoutPlanResponse> plans = workoutPlanService.getPublicWorkoutPlans();
        return ResponseEntity.ok(ApiResponse.success("Public workout plans retrieved successfully", plans));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchWorkoutPlans(@RequestParam String name) {
        List<WorkoutPlanResponse> plans = workoutPlanService.searchWorkoutPlans(name);
        return ResponseEntity.ok(ApiResponse.success("Workout plans retrieved successfully", plans));
    }

    /** Step 1 of the user flow: find library plans that match the requested gym days/week. */
    @GetMapping("/match")
    public ResponseEntity<ApiResponse> matchWorkoutPlans(@RequestParam Integer daysPerWeek,
                                                          Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long requesterId = ((SecurityUser) authentication.getPrincipal()).getId();
        List<WorkoutPlanResponse> plans = workoutPlanService.matchWorkoutPlans(daysPerWeek, requesterId);
        return ResponseEntity.ok(ApiResponse.success("Matching workout plans retrieved successfully", plans));
    }

    /** The plan the current user has selected as their active schedule, if any. */
    @GetMapping("/active/my")
    public ResponseEntity<ApiResponse> getMyActivePlan(Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long userId = ((SecurityUser) authentication.getPrincipal()).getId();
        WorkoutPlanResponse plan = workoutPlanService.getActivePlanForUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Active plan retrieved successfully", plan));
    }

    /** Step 3 of the user flow: select a previewed plan as the active schedule. */
    @PostMapping("/{id}/select")
    public ResponseEntity<ApiResponse> selectActivePlan(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long userId = ((SecurityUser) authentication.getPrincipal()).getId();
        WorkoutPlanResponse plan = workoutPlanService.selectActivePlan(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Plan selected as your active schedule", plan));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createWorkoutPlan(@Valid @RequestBody WorkoutPlanRequest request,
                                                          Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long creatorId = ((SecurityUser) authentication.getPrincipal()).getId();
        WorkoutPlanResponse plan = workoutPlanService.createWorkoutPlan(request, creatorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Workout plan created successfully", plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateWorkoutPlan(@PathVariable Long id,
                                                          @Valid @RequestBody WorkoutPlanRequest request) {
        WorkoutPlanResponse plan = workoutPlanService.updateWorkoutPlan(id, request);
        return ResponseEntity.ok(ApiResponse.success("Workout plan updated successfully", plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteWorkoutPlan(@PathVariable Long id) {
        workoutPlanService.deleteWorkoutPlan(id);
        return ResponseEntity.ok(ApiResponse.success("Workout plan deleted successfully"));
    }
}
