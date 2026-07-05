package com.hyperlift.service;

import com.hyperlift.config.AppConstants;
import com.hyperlift.dao.UserDao;
import com.hyperlift.dto.ProfileUpdateRequest;
import com.hyperlift.dto.UserResponse;
import com.hyperlift.entity.User;
import com.hyperlift.exception.UserNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userDao.findAll();
        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getRecentUsers(int limit) {
        return userDao.findAll().stream()
                .filter(u -> !AppConstants.ROLE_ADMIN.equalsIgnoreCase(u.getRole()))
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(limit)
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    /** Count of non-admin users, for the admin dashboard's "Total Users" stat. */
    public long countUsers() {
        return userDao.countByRoleNot(AppConstants.ROLE_ADMIN);
    }

    public UserResponse getUserById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return convertToUserResponse(user);
    }

    public UserResponse getUserByUsername(String username) {
        User user = userDao.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        return convertToUserResponse(user);
    }

    public UserResponse updateProfile(Long id, ProfileUpdateRequest request) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            userDao.findByUsername(request.getUsername()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(id)) {
                    throw new IllegalArgumentException("Username already taken: " + request.getUsername());
                }
            });
            user.setUsername(request.getUsername());
        }
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        if (request.getWeight() != null) {
            user.setWeight(request.getWeight());
        }
        if (request.getHeight() != null) {
            user.setHeight(request.getHeight());
        }

        User updatedUser = userDao.save(user);
        return convertToUserResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userDao.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userDao.deleteById(id);
    }

    public void deactivateUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setActive(false);
        userDao.save(user);
    }

    public void activateUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        user.setActive(true);
        userDao.save(user);
    }

    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .age(user.getAge())
                .gender(user.getGender())
                .weight(user.getWeight())
                .height(user.getHeight())
                .goal(user.getGoal())
                .experienceLevel(user.getExperienceLevel())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
