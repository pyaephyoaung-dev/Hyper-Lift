package com.hyperlift.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressRequest {

    private LocalDate recordDate;

    private Boolean restDay;

    /** Required unless restDay is true. */
    private Long exerciseId;

    /** Required unless restDay is true. */
    @PositiveOrZero(message = "Weight must not be negative")
    private Double weight;

    /** Required unless restDay is true. */
    @Min(value = 1, message = "Reps must be at least 1")
    private Integer reps;

    @DecimalMin(value = "0.0", message = "RPE must not be negative")
    @DecimalMax(value = "10.0", message = "RPE must not exceed 10")
    private Double rpe;

    @PositiveOrZero(message = "Rest time must not be negative")
    private Integer restTimeSeconds;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    /** Set implicitly from the authenticated user; not required from the client. */
    private Long userId;
}
