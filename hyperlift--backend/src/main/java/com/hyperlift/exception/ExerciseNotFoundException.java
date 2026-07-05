package com.hyperlift.exception;

public class ExerciseNotFoundException extends RuntimeException {

    public ExerciseNotFoundException(String message) {
        super(message);
    }

    public ExerciseNotFoundException(Long id) {
        super("Exercise not found with id: " + id);
    }
}
