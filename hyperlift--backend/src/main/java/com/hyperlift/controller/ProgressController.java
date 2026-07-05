package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.dto.ProgressRequest;
import com.hyperlift.dto.ProgressResponse;
import com.hyperlift.security.SecurityUser;
import com.hyperlift.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyProgress(Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long userId = ((SecurityUser) authentication.getPrincipal()).getId();
        List<ProgressResponse> progress = progressService.getProgressByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Progress records retrieved successfully", progress));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getProgressByUserId(@PathVariable Long userId) {
        List<ProgressResponse> progress = progressService.getProgressByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Progress records retrieved successfully", progress));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProgressById(@PathVariable Long id) {
        ProgressResponse progress = progressService.getProgressById(id);
        return ResponseEntity.ok(ApiResponse.success("Progress record retrieved successfully", progress));
    }

    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<ApiResponse> getProgressByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ProgressResponse> progress = progressService.getProgressByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Progress records retrieved successfully", progress));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createProgress(@Valid @RequestBody ProgressRequest request,
                                                       Authentication authentication) {
        if (authentication == null) {
            throw new com.hyperlift.exception.InvalidLoginException("Not authenticated");
        }
        Long userId = ((SecurityUser) authentication.getPrincipal()).getId();
        ProgressResponse progress = progressService.createProgress(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Progress record created successfully", progress));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProgress(@PathVariable Long id,
                                                       @Valid @RequestBody ProgressRequest request) {
        ProgressResponse progress = progressService.updateProgress(id, request);
        return ResponseEntity.ok(ApiResponse.success("Progress record updated successfully", progress));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProgress(@PathVariable Long id) {
        progressService.deleteProgress(id);
        return ResponseEntity.ok(ApiResponse.success("Progress record deleted successfully"));
    }
}
