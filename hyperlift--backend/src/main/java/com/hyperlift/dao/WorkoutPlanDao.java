package com.hyperlift.dao;

import com.hyperlift.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutPlanDao extends JpaRepository<WorkoutPlan, Long> {

    List<WorkoutPlan> findByUserId(Long userId);

    List<WorkoutPlan> findByIsPublicTrue();

    /** Plans matching a user's requested gym-days-per-week. */
    List<WorkoutPlan> findByDaysPerWeekAndIsPublicTrue(Integer daysPerWeek);

    List<WorkoutPlan> findByDifficultyLevel(String difficultyLevel);

    List<WorkoutPlan> findByNameContainingIgnoreCase(String name);
}
