package com.hyperlift.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress extends BaseEntity {

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "set_number")
    private Integer setNumber;

    @Column(name = "rpe")
    private Double rpe;

    @Column(name = "rest_time_seconds")
    private Integer restTimeSeconds;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Builder.Default
    @Column(name = "is_rest_day", nullable = false)
    private boolean restDay = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
