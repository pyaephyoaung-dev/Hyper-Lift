package com.hyperlift.exception;

public class DuplicateWorkoutException extends RuntimeException {

    public DuplicateWorkoutException(String message) {
        super(message);
    }
}
