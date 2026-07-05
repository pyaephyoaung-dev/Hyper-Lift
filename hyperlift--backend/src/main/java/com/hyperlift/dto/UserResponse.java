package com.hyperlift.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String role;
    private Integer age;
    private String gender;
    private Double weight;
    private Double height;
    private String goal;
    private String experienceLevel;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
