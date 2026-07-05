package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.dto.WorkoutSplitRequest;
import com.hyperlift.dto.WorkoutSplitResponse;
import com.hyperlift.service.WorkoutSplitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-splits")
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutSplitController {

    private final WorkoutSplitService workoutSplitService;

    public WorkoutSplitController(WorkoutSplitService workoutSplitService) {
        this.workoutSplitService = workoutSplitService;
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<ApiResponse> getSplitsByPlanId(@PathVariable Long planId) {
        List<WorkoutSplitResponse> splits = workoutSplitService.getSplitsByPlanId(planId);
        return ResponseEntity.ok(ApiResponse.success("Workout splits retrieved successfully", splits));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSplitById(@PathVariable Long id) {
        WorkoutSplitResponse split = workoutSplitService.getSplitById(id);
        return ResponseEntity.ok(ApiResponse.success("Workout split retrieved successfully", split));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createSplit(@Valid @RequestBody WorkoutSplitRequest request) {
        WorkoutSplitResponse split = workoutSplitService.createSplit(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Workout split created successfully", split));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateSplit(@PathVariable Long id,
                                                    @Valid @RequestBody WorkoutSplitRequest request) {
        WorkoutSplitResponse split = workoutSplitService.updateSplit(id, request);
        return ResponseEntity.ok(ApiResponse.success("Workout split updated successfully", split));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteSplit(@PathVariable Long id) {
        workoutSplitService.deleteSplit(id);
        return ResponseEntity.ok(ApiResponse.success("Workout split deleted successfully"));
    }
}
