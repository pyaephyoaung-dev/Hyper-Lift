package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.security.SecurityUser;
import com.hyperlift.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(
                "Admin dashboard retrieved successfully", dashboardService.getAdminDashboard()));
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getUserDashboard(Authentication authentication) {
        Long userId = currentUserId(authentication);
        return ResponseEntity.ok(ApiResponse.success(
                "User dashboard retrieved successfully", dashboardService.getUserDashboard(userId)));
    }

    private Long currentUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser securityUser)) {
            throw new IllegalStateException("Not authenticated");
        }
        return securityUser.getId();
    }
}
