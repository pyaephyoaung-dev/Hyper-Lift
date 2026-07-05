package com.hyperlift.exception;

public class WorkoutNotFoundException extends RuntimeException {

    public WorkoutNotFoundException(String message) {
        super(message);
    }

    public WorkoutNotFoundException(Long id) {
        super("Workout not found with id: " + id);
    }
}
