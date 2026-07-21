package com.hyperlift.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @Size(min = 6, max = 255, message = "Password must be at least 6 characters")
    private String newPassword;

    @Positive(message = "Body weight must be a positive number")
    private Double weight;

    @Positive(message = "Height must be a positive number")
    private Double height;
}
