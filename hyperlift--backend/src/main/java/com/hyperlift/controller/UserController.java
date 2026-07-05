package com.hyperlift.controller;

import com.hyperlift.dto.ApiResponse;
import com.hyperlift.dto.ProfileUpdateRequest;
import com.hyperlift.dto.UserResponse;
import com.hyperlift.security.SecurityUser;
import com.hyperlift.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getMyProfile(Authentication authentication) {
        Long id = currentUserId(authentication);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateMyProfile(Authentication authentication,
                                                         @Valid @RequestBody ProfileUpdateRequest request) {
        Long id = currentUserId(authentication);
        UserResponse updatedUser = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse> getUserByUsername(@PathVariable String username) {
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProfile(@PathVariable Long id,
                                                      @Valid @RequestBody ProfileUpdateRequest request) {
        UserResponse updatedUser = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully"));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully"));
    }

    private Long currentUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser securityUser)) {
            throw new IllegalStateException("Not authenticated");
        }
        return securityUser.getId();
    }
}
