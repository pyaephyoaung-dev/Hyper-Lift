package com.hyperlift.security;

import com.hyperlift.dao.UserDao;
import com.hyperlift.dto.LoginRequest;
import com.hyperlift.dto.LoginResponse;
import com.hyperlift.dto.RegisterRequest;
import com.hyperlift.entity.User;
import com.hyperlift.exception.InvalidLoginException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserDao userDao, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public boolean usernameExists(String username) {
        return userDao.existsByUsername(username);
    }

    public boolean emailExists(String email) {
        return userDao.existsByEmail(email);
    }

    public LoginResponse register(RegisterRequest request) {

        if (userDao.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken: " + request.getUsername());
        }

        if (userDao.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .age(request.getAge())
                .gender(request.getGender())
                .weight(request.getWeight())
                .height(request.getHeight())
                .goal(request.getGoal())
                .experienceLevel(request.getExperienceLevel())
                .active(true)
                .build();

        User savedUser = userDao.save(user);

        // Manually convert Entity to DTO
        return LoginResponse.builder()
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .height(savedUser.getHeight())
                .weight(savedUser.getWeight())
                .age(savedUser.getAge())
                .gender(savedUser.getGender())
                .goal(savedUser.getGoal())
                .experienceLevel(savedUser.getExperienceLevel())
                .message("Registration successful")
                .build();
    }

    public Authentication authenticate(LoginRequest request) {
        try {
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidLoginException("Invalid username or password");
        }
    }

    public LoginResponse buildLoginResponse(Authentication authentication) {
        SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();

        return LoginResponse.builder()
                .userId(securityUser.getId())
                .username(securityUser.getUsername())
                .email(securityUser.getEmail())
                .firstName(securityUser.getFirstName())
                .lastName(securityUser.getLastName())
                .role(securityUser.getRole())
                .height(securityUser.getHeight())
                .weight(securityUser.getWeight())
                .age(securityUser.getAge())
                .gender(securityUser.getGender())
                .goal(securityUser.getGoal())
                .experienceLevel(securityUser.getExperienceLevel())
                .message("Login successful")
                .build();
    }
}
