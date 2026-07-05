package com.hyperlift.exception;

public class InvalidLoginException extends RuntimeException {

    public InvalidLoginException(String message) {
        super(message);
    }

    public InvalidLoginException() {
        super("Invalid username or password");
    }
}
