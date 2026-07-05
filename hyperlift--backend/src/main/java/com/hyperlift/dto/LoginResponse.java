package com.hyperlift.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Double height;
    private Double weight;
    private Integer age;
    private String gender;
    private String goal;
    private String experienceLevel;
    private String message;
}
