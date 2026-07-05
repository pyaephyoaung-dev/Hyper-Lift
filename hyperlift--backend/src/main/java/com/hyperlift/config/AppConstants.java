package com.hyperlift.config;

public final class AppConstants {

    private AppConstants() {}

    // User Roles
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ADMIN = "ADMIN";

    // Workout Status
    public static final String STATUS_PLANNED = "PLANNED";
    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_CANCELLED = "CANCELLED";

    // Difficulty Levels
    public static final String DIFFICULTY_BEGINNER = "BEGINNER";
    public static final String DIFFICULTY_INTERMEDIATE = "INTERMEDIATE";
    public static final String DIFFICULTY_ADVANCED = "ADVANCED";
    public static final String DIFFICULTY_EXPERT = "EXPERT";

    // Muscle Groups
    public static final String MUSCLE_CHEST = "CHEST";
    public static final String MUSCLE_BACK = "BACK";
    public static final String MUSCLE_SHOULDERS = "SHOULDERS";
    public static final String MUSCLE_BICEPS = "BICEPS";
    public static final String MUSCLE_TRICEPS = "TRICEPS";
    public static final String MUSCLE_LEGS = "LEGS";
    public static final String MUSCLE_CORE = "CORE";
    public static final String MUSCLE_GLUTES = "GLUTES";
    public static final String MUSCLE_CALVES = "CALVES";
    public static final String MUSCLE_FOREARMS = "FOREARMS";
    public static final String MUSCLE_FULL_BODY = "FULL_BODY";

    // Exercise Categories
    public static final String CATEGORY_STRENGTH = "STRENGTH";
    public static final String CATEGORY_CARDIO = "CARDIO";
    public static final String CATEGORY_FLEXIBILITY = "FLEXIBILITY";
    public static final String CATEGORY_BALANCE = "BALANCE";
    public static final String CATEGORY_PLYOMETRIC = "PLYOMETRIC";

    // Pagination Defaults
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;

    // Days of Week
    public static final String DAY_MONDAY = "MONDAY";
    public static final String DAY_TUESDAY = "TUESDAY";
    public static final String DAY_WEDNESDAY = "WEDNESDAY";
    public static final String DAY_THURSDAY = "THURSDAY";
    public static final String DAY_FRIDAY = "FRIDAY";
    public static final String DAY_SATURDAY = "SATURDAY";
    public static final String DAY_SUNDAY = "SUNDAY";
    public static final String DAY_REST = "REST";
}
